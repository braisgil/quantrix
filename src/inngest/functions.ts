import { inngest } from "@/inngest/client";
import { recordInngestUsageAndCharge, recordAiUsageAndCharge } from "@/features/credits/server/usage";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { db } from "@/db";
import { agents, conversations, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { StreamTranscriptItem } from "@/features/conversations/types";

const summarizer = createAgent({
  name: "summarizer",
  system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a conversation and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const conversationsProcessing = inngest.createFunction(
  { id: "conversations/processing" },
  { event: "conversations/processing" },
  async ({ event, step }) => {
    const startedAt = Date.now();
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      // JSONL.parse returns plain objects; ensure correct array typing
      return JSONL.parse(response) as StreamTranscriptItem[];
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
       const speakerIds = [
         ...new Set(transcript.map((item) => item.speaker_id)),
       ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(conversations)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(conversations.id, event.data.conversationId))
    });

    // Attempt to attribute usage to the conversation owner for billing
    const [conv] = await db
      .select({ id: conversations.id, userId: conversations.userId })
      .from(conversations)
      .where(eq(conversations.id, event.data.conversationId));

    if (conv?.userId) {
      // Charge Inngest infra time
      const elapsedMs = Date.now() - startedAt;
      await recordInngestUsageAndCharge({
        userId: conv.userId,
        functionName: "conversations/processing",
        executionTimeMs: elapsedMs,
        metadata: { conversationId: conv.id },
      });

      // Estimate OpenAI token usage for summarizer and bill tokens
      const inputText = JSON.stringify(transcriptWithSpeakers);
      const outputText = (output[0] as TextMessage).content as string;
      const approxTokens = (text: string) => Math.ceil(text.length / 4);
      const promptTokens = approxTokens(inputText);
      const completionTokens = approxTokens(outputText);
      const totalTokens = promptTokens + completionTokens;

      await recordAiUsageAndCharge({
        userId: conv.userId,
        totalTokens,
        promptTokens,
        completionTokens,
        model: "gpt-4o",
      });
    }
  }
);

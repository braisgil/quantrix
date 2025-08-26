import { inngest } from "@/inngest/client";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { db } from "@/db";
import { agents, conversations, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { StreamTranscriptItem } from "@/features/conversations/types";
import { UsageTracker } from "@/lib/credits/usage-tracker";

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

    // Get conversation to find user for credit tracking
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, event.data.conversationId));

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Estimate tokens for summarization (rough estimate)
    const transcriptText = JSON.stringify(transcriptWithSpeakers);
    const estimatedInputTokens = Math.ceil(transcriptText.length / 4); // Rough estimate: 1 token ≈ 4 chars
    const estimatedOutputTokens = 1000; // Summary is typically shorter

    // Check if user has sufficient credits
    const estimatedCost = await UsageTracker.openai.estimateCost({
      model: "gpt-4o",
      estimatedInputTokens,
      estimatedOutputTokens,
    });

    if (!(await UsageTracker.canAfford(conversation.userId, estimatedCost.credits))) {
      // Mark conversation as failed due to insufficient credits
      await db
        .update(conversations)
        .set({
          status: "completed",
          summary: "[Summary generation failed: Insufficient credits]",
        })
        .where(eq(conversations.id, event.data.conversationId));
      
      throw new Error("Insufficient credits for summarization");
    }

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    // Track the actual usage (estimate based on output length)
    const actualOutputTokens = Math.ceil((output[0] as TextMessage).content.length / 4);
    await UsageTracker.openai.trackCompletion({
      userId: conversation.userId,
      model: "gpt-4o",
      usage: {
        prompt_tokens: estimatedInputTokens,
        completion_tokens: actualOutputTokens,
        total_tokens: estimatedInputTokens + actualOutputTokens,
      },
      conversationId: event.data.conversationId,
    });

    await step.run("save-summary", async () => {
      await db
        .update(conversations)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(conversations.id, event.data.conversationId))
    });
  }
);

// Note: Free credit replenishment is handled automatically and on-demand
// in CreditMeteringService.getUserBalance() - no cron job needed!

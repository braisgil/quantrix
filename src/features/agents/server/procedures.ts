import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure
  .input(agentsInsertSchema)
  .mutation(async ({ input, ctx }) => {
    const [createdAgent] = await ctx.db
      .insert(agents)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();

    return createdAgent;
  }),
});
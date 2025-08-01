import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";
import { agents } from "@/db/schema";
import { agentsInsertSchema, agentsUpdateSchema } from "@/db/validations";

export const agentsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id))
      .orderBy(agents.createdAt);
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const agent = await ctx.db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id))
        .limit(1);

      if (!agent[0] || agent[0].userId !== ctx.auth.user.id) {
        throw new Error("Agent not found");
      }

      return agent[0];
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [newAgent] = await ctx.db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return newAgent;
    }),

  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingAgent = await ctx.db
        .select()
        .from(agents)
        .where(eq(agents.id, id))
        .limit(1);

      if (!existingAgent[0] || existingAgent[0].userId !== ctx.auth.user.id) {
        throw new Error("Agent not found");
      }

      const [updatedAgent] = await ctx.db
        .update(agents)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(agents.id, id))
        .returning();

      return updatedAgent;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingAgent = await ctx.db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id))
        .limit(1);

      if (!existingAgent[0] || existingAgent[0].userId !== ctx.auth.user.id) {
        throw new Error("Agent not found");
      }

      await ctx.db.delete(agents).where(eq(agents.id, input.id));

      return { success: true };
    }),
}); 
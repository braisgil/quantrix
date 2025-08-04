import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { and, getTableColumns, desc, eq, ilike } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";

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
  getMany: protectedProcedure
  .input(
    z.object({
      search: z.string().nullish()
    })
  )
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select({
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          input.search ? ilike(agents.name, `%${input.search}%`) : undefined,
        )
      )
      .orderBy(desc(agents.createdAt), desc(agents.id))
    return {
      items: data,
    };
  }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [existingAgent] = await ctx.db
      .select({
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id),
        )
      );

    if (!existingAgent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }

    return existingAgent;
  }),
});
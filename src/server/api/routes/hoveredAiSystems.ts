import z from "zod/v4";
import { HoveredAiSystem } from "../models/hoveredAiSystem";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const hoveredAiSystemRouter = createTRPCRouter({
    create: publicProcedure
        .input(HoveredAiSystem)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newHoveredAiSystem] = await ctx.sql`
                INSERT INTO hovered_ai_systems (user_id, domain, ai_system_id, question_num, time)
                VALUES (${input.userId}, ${input.domain}, ${input.aiSystem}, ${input.questionNum}, NOW())
                RETURNING user_id AS "userId", domain AS "domain", ai_system_id AS "aiSystem", question_num AS "questionNum"
            `;

            return newHoveredAiSystem
        }),

    delete: publicProcedure
        .input(
              z.object({
                userId: z.string(),
              })
            )
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            await ctx.sql`
                DELETE FROM hovered_ai_systems
                WHERE user_id = ${input.userId}
            `;
        }),

    getHoveredAiSystems: publicProcedure
        .input(z.object({
            userId: z.string(),
            domain: z.string(),
            questionNum: z.number()
        }))
        .query(async (opts) => {
            const { ctx, input } = opts;

            const hoveredAiSystems = await ctx.sql`
                SELECT user_id AS "userId", domain AS "domain", ai_system_id AS "aiSystemId", question_num AS "questionNum" FROM hovered_ai_systems
                WHERE user_id = ${input.userId} AND domain = ${input.domain} AND question_num = ${input.questionNum}
            `;

            return hoveredAiSystems;
        })
});
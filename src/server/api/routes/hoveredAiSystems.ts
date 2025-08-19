import z from "zod/v4";
import { HoveredAiSystem } from "../models/hoveredAiSystem";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const hoveredAiSystemRouter = createTRPCRouter({
    create: publicProcedure
        .input(HoveredAiSystem)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newHoveredAiSystem] = await ctx.sql`
                INSERT INTO hovered_ai_systems (user_id, domain, ai_system_id)
                VALUES (${input.userId}, ${input.domain}, ${input.aiSystem})
                RETURNING user_id AS "userId", domain AS "domain", ai_system_id AS "aiSystem"
            `;

            return newHoveredAiSystem
        }),

    getHoveredAiSystems: publicProcedure
        .input(z.object({
            userId: z.string(),
            domain: z.string()
        }))
        .query(async (opts) => {
            const { ctx, input } = opts;

            const hoveredAiSystems = await ctx.sql`
                SELECT user_id AS "userId", domain AS "domain", ai_system_id AS "aiSystemId" FROM hovered_ai_systems
                WHERE user_id = ${input.userId} AND domain = ${input.domain}
            `;

            return hoveredAiSystems;
        })
});
import z from "zod/v4";
import { HoveredSystem } from "../models/hoveredSystem";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const hoveredSystemRouter = createTRPCRouter({
    create: publicProcedure
        .input(HoveredSystem)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newHoveredSystem] = await ctx.sql`
                INSERT INTO hovered_systems (user_id, domain, ai_system)
                VALUES (${input.user_id}, ${input.domain}, ${input.ai_system})
                RETURNING *
            `;

            return newHoveredSystem
        }),

    getHoveredSystems: publicProcedure
        .input(z.object({
            user_id: z.string(),
            domain: z.string()
        }))
        .query(async (opts) => {
            const { ctx, input } = opts;

            const hoveredSystems = await ctx.sql`
                SELECT * FROM hovered_systems
                WHERE user_id = ${input.user_id} AND domain = ${input.domain}
            `;

            return hoveredSystems;
        })
});
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Completion } from '../models/completion';
import z from 'zod/v4';

export const completionRouter = createTRPCRouter({
    create: publicProcedure
        .input(Completion)
        .mutation(async (opts) => {
            const { ctx, input } = opts;
            const [newCompletion] = await ctx.sql`
                INSERT INTO completions (user_id, coins) 
                VALUES (${input.userId}, ${input.coins}) 
                RETURNING user_id AS "userId", coins AS "coins"
            `;

            return newCompletion;
        }),

    getByUserId: publicProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async (opts) => {
            const { ctx, input } = opts;
            const [completion] = await ctx.sql`
                SELECT * FROM completions WHERE user_id = ${input.userId}
            `;
            if(!completion) return null;
            return completion as Completion;
        })
})
import { createTRPCRouter, publicProcedure } from "../trpc";
import { CompletionResponse } from "../models/completionResponse";


export const completionResponseRouter = createTRPCRouter({
    create: publicProcedure
        .input(CompletionResponse)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newCompletionResponse] = await ctx.sql`
                INSERT INTO completion_responses (user_id, response)
                VALUES (${input.userId}, ${input.response})
                RETURNING user_id AS "userId", response AS "response";
            `

            return newCompletionResponse;
        }),
})
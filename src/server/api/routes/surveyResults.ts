import z from "zod/v4";
import { SurveyResult } from "../models/surveyResult";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const surveyResultRouter = createTRPCRouter({
    create: publicProcedure
        .input(SurveyResult)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newSurveyResult] = await ctx.sql`
                INSERT INTO survey_results (user_id, domain, question_num, selected_lemon_num, selected_trust)
                VALUES (${input.userId}, ${input.domain}, ${input.questionNum}, ${input.selectedLemonNumber}, ${input.selectedTrust})
                RETURNING user_id AS "userId", domain, question_num AS "questionNum", selected_lemon_num AS "selectedLemonNumber", selected_trust AS "selectedTrust"
            `;

            return newSurveyResult;
        }),

    delete: publicProcedure
        .input(
            z.object({
                userId: z.string()
            })
        )
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            await ctx.sql`
                DELETE FROM survey_results
                WHERE user_id = ${input.userId}
            `;
        })
});
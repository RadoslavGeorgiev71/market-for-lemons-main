import { createTRPCRouter, publicProcedure } from "../trpc";
import { PreTaskAnswers } from "../models/preTaskAnswers";

export const preTaskAnswersRouter = createTRPCRouter({
    create: publicProcedure
        .input(PreTaskAnswers)
        .mutation(async (opts) => {
            const { ctx, input } = opts;

            const [newPreTaskAnswer] = await ctx.sql`
                INSERT INTO pretask_questions (user_id, loan_approval, deceptive_reviews, skin_cancer, risk, technology1, technology2, technology3, technology4, ai_literacy1, ai_literacy2, ai_literacy3, ai_literacy4, attention1, attention2)
                VALUES (${input.userId}, ${input.loanApproval}, ${input.deceptionDetection}, ${input.skinCancerDetection}, ${input.risk}, ${input.technology1}, ${input.technology2}, ${input.technology3}, ${input.technology4}, ${input.aiLiteracy1}, ${input.aiLiteracy2}, ${input.aiLiteracy3}, ${input.aiLiteracy4}, ${input.attention1}, ${input.attention2})
                RETURNING user_id AS "userId", loan_approval AS "loanApproval", deceptive_reviews AS "deceptionDetection", skin_cancer AS "skinCancerDetection", risk, technology1, technology2, technology3, technology4, ai_literacy1 AS "aiLiteracy1", ai_literacy2 AS "aiLiteracy2", ai_literacy3 AS "aiLiteracy3", ai_literacy4 AS "aiLiteracy4", attention1, attention2
            `;

            return newPreTaskAnswer
        }),
});
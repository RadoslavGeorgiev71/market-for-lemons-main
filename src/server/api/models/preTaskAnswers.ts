import { z } from "zod/v4";

const PreTaskAnswers = z.object({
    userId: z.string(),

    loanApproval: z.number(),
    deceptionDetection: z.number(),
    skinCancerDetection: z.number(),

    risk: z.number(),
    trust1: z.number(),
    trust2: z.number(),

    technology1: z.number(),
    technology2: z.number(),
    technology3: z.number(),
    technology4: z.number(),

    aiLiteracy1: z.number(),
    aiLiteracy2: z.number(),
    aiLiteracy3: z.number(),
    aiLiteracy4: z.number(),

    attention1: z.boolean(),
    attention2: z.boolean(),
});

export type PreTaskAnswers = z.infer<typeof PreTaskAnswers>;
export { PreTaskAnswers };
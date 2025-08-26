import { z } from "zod/v4";

const SurveyResult = z.object({
    userId: z.string(),
    domain: z.string(),
    questionNum: z.number(),
    selectedLemonNumber: z.number(),
    selectedTrust: z.number(),
});

export type SurveyResult = z.infer<typeof SurveyResult>;
export { SurveyResult };

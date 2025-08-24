import { z } from "zod/v4";

const HoveredAiSystem = z.object({
  userId: z.string(),
  domain: z.string(),
  aiSystem: z.string(),
  questionNum: z.number()
});

export type HoveredAiSystem = z.infer<typeof HoveredAiSystem>;
export { HoveredAiSystem };
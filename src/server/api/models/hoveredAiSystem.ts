import { z } from "zod/v4";

const HoveredAiSystem = z.object({
  userId: z.string(),
  aiSystem: z.string(),
});

export type HoveredAiSystem = z.infer<typeof HoveredAiSystem>;
export { HoveredAiSystem };
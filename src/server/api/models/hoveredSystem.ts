import { z } from "zod/v4";

const HoveredSystem = z.object({
  user_id: z.string(),
  domain: z.string(),
  ai_system: z.number(),
});

export type HoveredSystem = z.infer<typeof HoveredSystem>;
export { HoveredSystem };
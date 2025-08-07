import { z } from "zod/v4";

const Task = z.object({
  user_id: z.string(),
  domain: z.string(),
  question: z.string(),
  ai_system: z.string(),
  ai_advice: z.string(),
  initial_confidence: z.number(),
  final_confidence: z.number(),
});

export type Task = z.infer<typeof Task>;
export { Task };

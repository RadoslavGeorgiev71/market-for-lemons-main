import { z } from "zod/v4";

const Task = z.object({
  userId: z.string(),
  domain: z.string(),
  questionNum: z.number(),
  taskId: z.string(),
  usedAI: z.boolean(),
  systemId: z.string(),
  succeeded: z.boolean(),
  timeSpent: z.number(),
});

export type Task = z.infer<typeof Task>;
export { Task };

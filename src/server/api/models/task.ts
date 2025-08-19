import { z } from "zod/v4";
import { ta } from "zod/v4/locales";

const Task = z.object({
  userId: z.string(),
  domain: z.string(),
  questionNum: z.number(),
  taskId: z.string(),
  usedAI: z.boolean(),
  systemId: z.string(),
  succeeded: z.boolean(),
});

export type Task = z.infer<typeof Task>;
export { Task };

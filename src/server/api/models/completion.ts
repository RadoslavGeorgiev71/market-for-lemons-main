import { z } from "zod/v4";

const Completion = z.object({
  userId: z.string(),
  coins: z.number()
});

export type Completion = z.infer<typeof Completion>;
export { Completion };

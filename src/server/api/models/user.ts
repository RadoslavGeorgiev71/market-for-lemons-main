import { State } from "@/types/state";
import { Disclosure } from "@/types/disclosure";
import { z } from "zod/v4";

const User = z.object({
  userId: z.string(),
  state: z.enum(State),
  disclosure: z.enum(Disclosure),
});

export type User = z.infer<typeof User>;

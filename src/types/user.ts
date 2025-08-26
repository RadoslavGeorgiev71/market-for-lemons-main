import { Disclosure } from "./disclosure";
import { LemonDensity } from "./lemonDensity";
import { State } from "./state";

export interface User {
  userId: string;
  state: State;
  disclosure: Disclosure;
  lemonDensity: LemonDensity;
  studyId: string;
  sessionId: string;
}
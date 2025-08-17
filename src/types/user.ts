import { Disclosure } from "./disclosure";
import { State } from "./state";

export interface User {
  userId: string;
  state: State;
  disclosure: Disclosure;
}
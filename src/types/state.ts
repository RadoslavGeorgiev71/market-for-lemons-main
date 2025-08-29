import { failed_attention_check } from "@/data/constants";

export enum State {
  preTaskQuestions = "preTaskQuestions",

  instructions = "instructions",

  preTask1 = "preTask1",
  finance = "finance",

  preTask2 = "preTask2",
  reviews = "reviews",

  preTask3 = "preTask3",
  medical = "medical",

  completion_screen = "completion_screen",
  fully_completed = "fully_completed",

  revoked_consent = "revoked_consent",
  failed_attention_check = "failed_attention_check",
  failed_comprehension_questions = "failed_comprehension_questions",
  failed_completion = "failed_completion"
}
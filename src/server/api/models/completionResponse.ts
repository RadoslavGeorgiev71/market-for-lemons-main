import z from "zod/v4";

const CompletionResponse = z.object({
    userId: z.string(),
    response: z.string(),
})

export type CompletionResponse = z.infer<typeof CompletionResponse>;
export { CompletionResponse };
import { createTRPCRouter, createCallerFactory} from "./trpc";
import { userRouter } from "./routes/users";
import { taskRouter } from "./routes/tasks";
import { hoveredAiSystemRouter } from "./routes/hoveredAiSystems";
import { surveyResultRouter } from "./routes/surveyResults";
import { completionRouter } from "./routes/completions";
import { preTaskAnswersRouter } from "./routes/preTaskAnswers";
import { completionResponseRouter } from "./routes/completionResponses";

// Define the main router that takes the child routes.
export const appRouter = createTRPCRouter({
    user: userRouter,
    task: taskRouter,
    hoveredAiSystem: hoveredAiSystemRouter,
    surveyResult: surveyResultRouter,
    completion: completionRouter,
    preTaskAnswers: preTaskAnswersRouter,
    completionResponse: completionResponseRouter,
})

// Export the type definition of the API
export type AppRouter = typeof appRouter

// Create a server-side caller for the tRPC API.
export const createCaller = createCallerFactory(appRouter)

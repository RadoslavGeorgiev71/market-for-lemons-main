import { createTRPCRouter, createCallerFactory} from "./trpc";
import { userRouter } from "./routes/users";
import { taskRouter } from "./routes/tasks";
import { hoveredAiSystemRouter } from "./routes/hoveredAiSystems";
import { surveyResultRouter } from "./routes/surveyResults";

// Define the main router that takes the child routes.
export const appRouter = createTRPCRouter({
    user: userRouter,
    task: taskRouter,
    hoveredAiSystem: hoveredAiSystemRouter,
    surveyResult: surveyResultRouter
})

// Export the type definition of the API
export type AppRouter = typeof appRouter

// Create a server-side caller for the tRPC API.
export const createCaller = createCallerFactory(appRouter)

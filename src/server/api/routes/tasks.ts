import { createTRPCRouter, publicProcedure } from '../trpc';
import { Task } from '../models/task';
import { z } from 'zod';

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(Task)
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const [newTask] = await ctx.sql`
        INSERT INTO tasks (user_id, domain, question_num, task_id, used_ai, ai_system_id, succeeded) 
        VALUES (${input.userId}, ${input.domain}, ${input.questionNum}, ${input.taskId}, ${input.usedAI}, ${input.systemId}, ${input.succeeded}) 
        RETURNING user_id AS "userId", domain AS "domain", question_num AS "questionNum", task_id AS "taskId", used_ai AS "usedAI", ai_system_id AS "systemId", succeeded AS "succeeded"
      `;

      return newTask;
    }),

  getTasksForUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        domain: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const tasks = await sql`
        SELECT user_id AS "userId", domain AS "domain", question_num AS "questionNum", task_id AS "taskId", used_ai AS "usedAI", ai_system_id AS "systemId", succeeded AS "succeeded"
        FROM tasks WHERE user_id = ${input.userId} AND domain = ${input.domain}
      `;
      return tasks as unknown as Task[];
    }
  ),
});

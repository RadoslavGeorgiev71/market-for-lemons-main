import { createTRPCRouter, publicProcedure } from '../trpc';
import { Task } from '../models/task';
import { z } from 'zod';

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(Task)
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const [newTask] = await ctx.sql`
        INSERT INTO tasks (user_id, domain, question_num, question, ai_system, ai_advice, initial_confidence, final_confidence, final_answer) 
        VALUES (${input.user_id}, ${input.domain}, ${input.question_num}, ${input.question}, ${input.ai_system}, ${input.ai_advice}, ${input.initial_confidence}, ${input.final_confidence}, ${input.final_answer}) 
        RETURNING *
      `;

      return newTask;
    }),

  getTasksByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const tasks = await sql`
        SELECT * FROM tasks WHERE user_id = ${input.userId}
      `;
      return tasks as unknown as Task[];
    }
  ),
});

import z from "zod/v4";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { State } from "@/types/state";
import { User } from "../models/user";
import { Disclosure } from "@/types/disclosure";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        state: z.enum(State),
        disclosure: z.enum(Disclosure),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const [existingUser] =
        await ctx.sql`SELECT user_id AS "userId", state, disclosure 
          FROM users WHERE user_id = ${input.userId}`;

      if (existingUser) return existingUser as User;

      const [newUser] =
        await ctx.sql`INSERT INTO users (user_id, state, disclosure) VALUES (${input.userId}, ${input.state}, ${input.disclosure}) RETURNING 
          user_id AS "userId", state, disclosure`;

      return newUser as User;
    }),
  getUserById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`SELECT user_id AS "userId", state, disclosure 
          FROM users WHERE user_id = ${input.userId}`;
      if (!user) {
        return null;
      }
      return user as User;
    }),
  updateState: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        state: z.enum(State),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`UPDATE users SET state = ${input.state} WHERE user_id = ${input.userId} RETURNING 
          user_id AS "userId", state, disclosure`;
      return user as User;
    }),
    updateDisclosure: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        disclosure: z.enum(Disclosure),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`UPDATE users SET disclosure = ${input.disclosure} WHERE user_id = ${input.userId} RETURNING 
          user_id AS "userId", state, disclosure`;
      return user as User;
    }
  ),
  delete: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sql = ctx.sql;
      await sql`DELETE FROM users WHERE user_id = ${input.userId}`;
      await sql`DELETE FROM tasks WHERE user_id = ${input.userId}`;
      return { success: true };
    }),
});

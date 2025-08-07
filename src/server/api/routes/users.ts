import z from "zod/v4";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { State } from "@/types/state";
import { User } from "../models/user";
import { Disclosure } from "@/types/disclosure";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        state: z.enum(State),
        disclosure: z.enum(Disclosure),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const [existingUser] =
        await ctx.sql`SELECT * FROM users WHERE user_id = ${input.user_id}`;

      if (existingUser) return existingUser as User;

      const [newUser] =
        await ctx.sql`INSERT INTO users (user_id, state, disclosure) VALUES (${input.user_id}, ${input.state}, ${input.disclosure}) RETURNING *`;

      return newUser;
    }),
  getUserById: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`SELECT * FROM users WHERE user_id = ${input.user_id}`;
      if (!user) {
        return null;
      }
      return user;
    }),
  updateState: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        state: z.enum(State),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`UPDATE users SET state = ${input.state} WHERE user_id = ${input.user_id} RETURNING *`;
      return user;
    }),
    updateDisclosure: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        disclosure: z.enum(Disclosure),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sql = ctx.sql;
      const [user] =
        await sql`UPDATE users SET disclosure = ${input.disclosure} WHERE user_id = ${input.user_id} RETURNING *`;
      return user;
    }
  ),
});

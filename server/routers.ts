import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  comments: router({
    createComment: publicProcedure.input(z.object({
      postId: z.number(),
      authorName: z.string().min(1),
      authorEmail: z.string().email(),
      content: z.string().min(1),
    })).mutation(async ({ input }) => {
      return db.createComment({
        ...input,
        status: 'pending',
      });
    }),
    getCommentsByPostId: publicProcedure.input(z.object({
      postId: z.number(),
    })).query(async ({ input }) => {
      const allComments = await db.getCommentsByPostId(input.postId);
      return allComments.filter(c => c.status === 'approved');
    }),
    getPendingComments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can view pending comments');
      }
      return db.getPendingComments();
    }),
    updateCommentStatus: protectedProcedure.input(z.object({
      commentId: z.number(),
      status: z.enum(['pending', 'approved', 'rejected']),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can moderate comments');
      }
      await db.updateCommentStatus(input.commentId, input.status);
      return { success: true };
    }),
    deleteComment: protectedProcedure.input(z.object({
      commentId: z.number(),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can delete comments');
      }
      await db.deleteComment(input.commentId);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;

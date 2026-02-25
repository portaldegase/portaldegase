import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSocialMediaShares, updateSocialMediaShareStatus, saveSocialMediaCredential, getSocialMediaCredential, recordSocialMediaShare } from "./db";

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

  analytics: router({
    recordView: publicProcedure.input(z.object({
      postId: z.number(),
      ipHash: z.string().optional(),
      userAgent: z.string().optional(),
      referrer: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.recordPageView({
        postId: input.postId,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
        referrer: input.referrer,
      });
      return { success: true };
    }),
    getPostAnalytics: publicProcedure.input(z.object({
      postId: z.number(),
    })).query(async ({ input }) => {
      return db.getPostAnalytics(input.postId);
    }),
    getTopPosts: protectedProcedure.input(z.object({
      limit: z.number().default(10),
    })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can view analytics');
      }
      return db.getTopPosts(input.limit);
    }),
    getAnalyticsByDateRange: protectedProcedure.input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can view analytics');
      }
      return db.getAnalyticsByDateRange(input.startDate, input.endDate);
    }),
    getPostViewsLastDays: protectedProcedure.input(z.object({
      days: z.number().default(30),
    })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can view analytics');
      }
      return db.getPostViewsLastDays(input.days);
    }),
  }),
});

export type AppRouter = typeof appRouter;

  social: router({
    saveFacebookCredential: protectedProcedure
      .input(z.object({
        accessToken: z.string(),
        pageId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return saveSocialMediaCredential('facebook', input.accessToken, null, null, input.pageId);
      }),

    saveTwitterCredential: protectedProcedure
      .input(z.object({
        accessToken: z.string(),
        accountId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return saveSocialMediaCredential('twitter', input.accessToken, null, null, null, input.accountId);
      }),

    saveInstagramCredential: protectedProcedure
      .input(z.object({
        accessToken: z.string(),
        accountId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return saveSocialMediaCredential('instagram', input.accessToken, null, null, null, input.accountId);
      }),

    getCredentials: protectedProcedure
      .input(z.object({
        platform: z.enum(['facebook', 'twitter', 'instagram']),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return getSocialMediaCredential(input.platform);
      }),

    recordShare: protectedProcedure
      .input(z.object({
        postId: z.number(),
        platform: z.enum(['facebook', 'twitter', 'instagram']),
        sharedUrl: z.string().optional(),
        status: z.enum(['pending', 'success', 'failed']).default('pending'),
        errorMessage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return recordSocialMediaShare(input.postId, input.platform, input.sharedUrl, input.status, input.errorMessage);
      }),

    getShares: protectedProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return getSocialMediaShares(input.postId);
      }),

    updateShareStatus: protectedProcedure
      .input(z.object({
        shareId: z.number(),
        status: z.enum(['pending', 'success', 'failed']),
        sharedUrl: z.string().optional(),
        errorMessage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return updateSocialMediaShareStatus(input.shareId, input.status, input.sharedUrl, input.errorMessage);
      }),
  })

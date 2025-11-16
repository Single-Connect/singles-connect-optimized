import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
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

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      return user;
    }),

    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        birthDate: z.date().optional(),
        bio: z.string().optional(),
        interests: z.string().optional(),
        profilePhotoUrl: z.string().optional(),
        hairColor: z.string().optional(),
        eyeColor: z.string().optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        origin: z.string().optional(),
        bodyType: z.string().optional(),
        hasChildren: z.boolean().optional(),
        wantsChildren: z.boolean().optional(),
        lookingFor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUserProfile(ctx.user.id, input);
      }),

    uploadPhoto: protectedProcedure
      .input(z.object({
        photoUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUserProfile(ctx.user.id, { profilePhotoUrl: input.photoUrl });
      }),
  }),

  swipe: router({
    getProfiles: protectedProcedure.query(async ({ ctx }) => {
      // TODO: Implement smart matching algorithm
      const allUsers = await db.getAllUsers();
      return allUsers.filter(u => u.id !== ctx.user.id).slice(0, 10);
    }),

    swipe: protectedProcedure
      .input(z.object({
        targetUserId: z.number(),
        direction: z.enum(['left', 'right', 'super']),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement swipe logic and match detection
        return { success: true, isMatch: false };
      }),
  }),

  coins: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return { coins: user?.coins || 0 };
    }),

    addCoins: protectedProcedure
      .input(z.object({
        amount: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const newBalance = await db.updateUserCoins(ctx.user.id, input.amount);
        return { coins: newBalance };
      }),

    purchase: protectedProcedure
      .input(z.object({
        packageId: z.string(),
        amount: z.number(),
        price: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement payment processing
        const newBalance = await db.updateUserCoins(ctx.user.id, input.amount);
        return { success: true, coins: newBalance };
      }),
  }),

  admin: router({
    getUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return db.getAllUsers();
    }),

    updateUserRole: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(['user', 'admin']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return db.updateUserRole(input.userId, input.role);
      }),

    updateUserVipStatus: protectedProcedure
      .input(z.object({
        userId: z.number(),
        isVip: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return db.updateUserVipStatus(input.userId, input.isVip);
      }),

    addUserCoins: protectedProcedure
      .input(z.object({
        userId: z.number(),
        amount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return db.updateUserCoins(input.userId, input.amount);
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { invokeLLM, type Message } from "./_core/llm";
import Stripe from "stripe";
import { COIN_PRODUCTS, getProductById } from "./products";
import { ENV } from "./_core/env";

export const appRouter = router({
  system: systemRouter,
  
  gamification: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return {
        level: user?.level || 1,
        xp: user?.xp || 0,
        achievements: user?.achievements ? JSON.parse(user.achievements as string) : [],
        totalSwipes: await db.getUserSwipeCount(ctx.user.id),
        totalMatches: await db.getUserMatchCount(ctx.user.id),
        totalMessages: 0,
      };
    }),
    getDailyReward: protectedProcedure.query(async ({ ctx }) => {
      const reward = await db.getDailyReward(ctx.user.id);
      const today = new Date().toISOString().split('T')[0];
      const claimed = reward?.lastClaimDate === today;
      return {
        streak: reward?.streakCount || 0,
        coins: Math.min(10 + (reward?.streakCount || 0) * 2, 50),
        claimed,
      };
    }),
    claimDailyReward: protectedProcedure.mutation(async ({ ctx }) => {
      const reward = await db.getDailyReward(ctx.user.id);
      const today = new Date().toISOString().split('T')[0];
      
      if (reward?.lastClaimDate === today) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Belohnung bereits abgeholt!' });
      }
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const isStreak = reward?.lastClaimDate === yesterday;
      const newStreak = isStreak ? (reward.streakCount || 0) + 1 : 1;
      const coins = Math.min(10 + newStreak * 2, 50);
      
      await db.claimDailyReward(ctx.user.id, newStreak);
      await db.addCoins(ctx.user.id, coins);
      await db.addXP(ctx.user.id, 10);
      
      return { coins, streak: newStreak };
    }),
  }),
  
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

  productAdvisor: router({
    chat: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Call OpenAI for intelligent product recommendations
        const systemPrompt = `Du bist ein freundlicher und kompetenter Produkt-Berater für eine Dating-App. 
Deine Aufgabe ist es, Nutzern bei der Auswahl von Produkten zu helfen - insbesondere:
- Hautpflege und Kosmetik
- Parfüm und Düfte
- Mode und Accessoires
- Geschenke für Dates
- Wellness und Self-Care

Gib konkrete Produktempfehlungen mit:
1. Produktname und Marke
2. Warum es passt
3. Ungefährer Preis
4. Wo man es kaufen kann (Amazon, Douglas, etc.)

Sei persönlich, hilfsbereit und enthusiastisch! Nutze Emojis sparsam aber passend.`;

        const messages: Message[] = [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: input.message
          }
        ];

        const response = await invokeLLM({ messages });

        const content = response.choices[0]?.message?.content;
        const responseText = typeof content === 'string' ? content : "Entschuldigung, ich konnte keine Antwort generieren.";
        
        return {
          response: responseText
        };
      }),
  }),

  payment: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        packageId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const product = getProductById(input.packageId);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
          apiVersion: "2025-10-29.clover",
        });

        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const totalCoins = product.coins + (product.bonus || 0);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: product.name,
                  description: `${totalCoins} Coins für Single-Connect`,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/shop?success=true`,
          cancel_url: `${origin}/shop?canceled=true`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            package_id: product.id,
            coins: totalCoins.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
        });

        return {
          url: session.url,
        };
      }),

    getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
      // TODO: Implement payment history from database
      return [];
    }),
  }),
});

export type AppRouter = typeof appRouter;

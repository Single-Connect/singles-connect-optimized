import { eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, swipes, matches, dailyRewards } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: {
  name?: string;
  birthDate?: Date;
  bio?: string;
  interests?: string;
  profilePhotoUrl?: string;
  hairColor?: string;
  eyeColor?: string;
  height?: number;
  weight?: number;
  origin?: string;
  bodyType?: string;
  hasChildren?: boolean;
  wantsChildren?: boolean;
  lookingFor?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(data).where(eq(users.id, userId));
  return getUserById(userId);
}

export async function updateUserCoins(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const newCoins = (user.coins || 0) + amount;
  await db.update(users).set({ coins: newCoins }).where(eq(users.id, userId));
  
  return newCoins;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(users);
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ role }).where(eq(users.id, userId));
  return getUserById(userId);
}

export async function updateUserVipStatus(userId: number, isVip: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ isVip }).where(eq(users.id, userId));
  return getUserById(userId);
}


// Gamification functions
export async function getUserSwipeCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select().from(swipes).where(eq(swipes.swiperId, userId));
  return result.length;
}

export async function getUserMatchCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select().from(matches).where(
    or(eq(matches.user1Id, userId), eq(matches.user2Id, userId))
  );
  return result.length;
}

export async function getDailyReward(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(dailyRewards).where(eq(dailyRewards.userId, userId)).limit(1);
  return result[0] || null;
}

export async function claimDailyReward(userId: number, streakCount: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const today = new Date();
  
  await db.insert(dailyRewards).values({
    userId,
    lastClaimDate: today,
    streakCount,
  }).onDuplicateKeyUpdate({
    set: {
      lastClaimDate: today,
      streakCount,
    },
  });
}

export async function addCoins(userId: number, amount: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const user = await getUserById(userId);
  const newBalance = (user?.coins || 0) + amount;
  
  await db.update(users).set({ coins: newBalance }).where(eq(users.id, userId));
  return newBalance;
}

export async function addXP(userId: number, amount: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const user = await getUserById(userId);
  const newXP = (user?.xp || 0) + amount;
  
  // Level up logic
  const LEVELS = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 100 },
    { level: 3, xpRequired: 300 },
    { level: 4, xpRequired: 600 },
    { level: 5, xpRequired: 1000 },
    { level: 6, xpRequired: 1500 },
    { level: 7, xpRequired: 2500 },
    { level: 8, xpRequired: 5000 },
  ];
  
  const newLevel = LEVELS.reverse().find(l => newXP >= l.xpRequired)?.level || 1;
  
  await db.update(users).set({ xp: newXP, level: newLevel }).where(eq(users.id, userId));
}


// Setup admin user with unlimited access
export async function setupAdminUser(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot setup admin: database not available");
    return false;
  }

  try {
    await db.update(users)
      .set({
        role: "admin",
        isPremium: true,
        coins: 999999,
        level: 99,
        xp: 999999,
        premiumExpiresAt: null, // Lifetime premium
      })
      .where(eq(users.id, userId));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to setup admin:", error);
    return false;
  }
}

// Check if user is admin
export async function isAdmin(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return result.length > 0 && result[0].role === "admin";
  } catch (error) {
    console.error("[Database] Failed to check admin:", error);
    return false;
  }
}

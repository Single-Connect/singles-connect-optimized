import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended for Single-Connect dating platform
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Profile fields
  birthDate: timestamp("birthDate"),
  age: int("age"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  zodiacSign: varchar("zodiacSign", { length: 20 }),
  profilePhotoUrl: text("profilePhotoUrl"),
  bio: text("bio"),
  interests: text("interests"), // JSON array as text
  hairColor: varchar("hairColor", { length: 50 }),
  eyeColor: varchar("eyeColor", { length: 50 }),
  height: int("height"), // in cm
  weight: int("weight"), // in kg
  origin: varchar("origin", { length: 100 }),
  bodyType: varchar("bodyType", { length: 50 }),
  hasChildren: boolean("hasChildren"),
  wantsChildren: boolean("wantsChildren"),
  lookingFor: text("lookingFor"),
  
  // Location
  locationLat: decimal("locationLat", { precision: 10, scale: 8 }),
  locationLng: decimal("locationLng", { precision: 11, scale: 8 }),
  locationUpdatedAt: timestamp("locationUpdatedAt"),
  
  // Gamification
  coins: int("coins").default(0).notNull(),
  level: int("level").default(1).notNull(),
  xp: int("xp").default(0).notNull(),
  streakCount: int("streakCount").default(0).notNull(),
  lastLoginDate: timestamp("lastLoginDate"),
  
  // Premium
  isPremium: boolean("isPremium").default(false).notNull(),
  premiumExpiresAt: timestamp("premiumExpiresAt"),
  isVip: boolean("isVip").default(false).notNull(),
  vipCodeUsed: varchar("vipCodeUsed", { length: 50 }),
  
  // Verification
  isVerified: boolean("isVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 64 }),
  
  // Password reset
  resetToken: varchar("resetToken", { length: 64 }),
  resetTokenExpires: timestamp("resetTokenExpires"),
  
  // Activity
  isActive: boolean("isActive").default(true).notNull(),
  lastSeen: timestamp("lastSeen"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Swipes table - tracks user swipes (like/dislike)
 */
export const swipes = mysqlTable("swipes", {
  id: int("id").autoincrement().primaryKey(),
  swiperId: int("swiperId").notNull(),
  swipedId: int("swipedId").notNull(),
  direction: mysqlEnum("direction", ["left", "right", "super"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Matches table - mutual likes
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  matchedAt: timestamp("matchedAt").defaultNow().notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

/**
 * Gifts table - virtual and real gifts
 */
export const gifts = mysqlTable("gifts", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  giftType: varchar("giftType", { length: 50 }).notNull(), // 'virtual', 'flowers', 'chocolate', 'jewelry', etc.
  giftName: varchar("giftName", { length: 100 }).notNull(),
  giftData: text("giftData"), // JSON with details (image, price, affiliate_link, etc.)
  price: int("price").notNull(), // in coins or cents
  status: mysqlEnum("status", ["pending", "sent", "delivered", "failed"]).default("pending").notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

/**
 * Achievements table - gamification badges
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementType: varchar("achievementType", { length: 50 }).notNull(), // 'first_match', 'profile_complete', '10_swipes', etc.
  achievementName: varchar("achievementName", { length: 100 }).notNull(),
  achievementDescription: text("achievementDescription"),
  iconUrl: text("iconUrl"),
  xpReward: int("xpReward").default(0).notNull(),
  coinsReward: int("coinsReward").default(0).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

/**
 * Daily rewards table - streak tracking
 */
export const dailyRewards = mysqlTable("dailyRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lastClaimDate: timestamp("lastClaimDate").notNull(),
  streakCount: int("streakCount").default(1).notNull(),
  coinsEarned: int("coinsEarned").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Products table - for product advisor
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // 'beauty', 'fashion', 'gifts', 'electronics', etc.
  price: int("price"), // in cents
  affiliateLink: text("affiliateLink").notNull(),
  affiliatePartner: varchar("affiliatePartner", { length: 50 }), // 'amazon', 'douglas', 'zalando', etc.
  imageUrl: text("imageUrl"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Chat history table - for product advisor AI
 */
export const chatHistory = mysqlTable("chatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  context: text("context"), // JSON with additional context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * VIP codes table - for admin to create VIP access codes
 */
export const vipCodes = mysqlTable("vipCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  maxUses: int("maxUses").default(1).notNull(),
  usedCount: int("usedCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Activities table - dating activities/events
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  activityType: varchar("activityType", { length: 50 }).notNull(), // 'speed_dating', 'workshop', 'party', etc.
  location: varchar("location", { length: 200 }),
  locationLat: decimal("locationLat", { precision: 10, scale: 8 }),
  locationLng: decimal("locationLng", { precision: 11, scale: 8 }),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  maxParticipants: int("maxParticipants"),
  currentParticipants: int("currentParticipants").default(0).notNull(),
  price: int("price").default(0).notNull(), // in coins or cents
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Activity participants table
 */
export const activityParticipants = mysqlTable("activityParticipants", {
  id: int("id").autoincrement().primaryKey(),
  activityId: int("activityId").notNull(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["registered", "confirmed", "cancelled"]).default("registered").notNull(),
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
});

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'new_match', 'new_message', 'gift_received', etc.
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message"),
  data: text("data"), // JSON with additional data
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

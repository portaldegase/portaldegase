import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
// ==================== COMMENTS TABLE ====================
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// ==================== ANALYTICS TABLE ====================
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
  lastViewedAt: timestamp("lastViewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// ==================== PAGE VIEWS TABLE ====================
export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  ipHash: varchar("ipHash", { length: 64 }),
  userAgent: text("userAgent"),
  referrer: text("referrer"),
});


// Social Media Sharing
export const socialMediaShares = mysqlTable('social_media_shares', {
  id: int('id').autoincrement().primaryKey(),
  postId: int('postId').notNull(),
  platform: text('platform').notNull(),
  sharedUrl: text('sharedUrl'),
  sharedAt: timestamp('sharedAt').defaultNow().notNull(),
  status: text('status').notNull().default('pending'),
  errorMessage: text('errorMessage'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
export type SocialMediaShare = typeof socialMediaShares.$inferSelect;
export type InsertSocialMediaShare = typeof socialMediaShares.$inferInsert;

// Social Media Credentials
export const socialMediaCredentials = mysqlTable('social_media_credentials', {
  id: int('id').autoincrement().primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull().unique(),
  accessToken: text('accessToken').notNull(),
  refreshToken: text('refreshToken'),
  expiresAt: int('expiresAt'),
  pageId: varchar('pageId', { length: 255 }),
  accountId: varchar('accountId', { length: 255 }),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});
export type SocialMediaCredential = typeof socialMediaCredentials.$inferSelect;
export type InsertSocialMediaCredential = typeof socialMediaCredentials.$inferInsert;

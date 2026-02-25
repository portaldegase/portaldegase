import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertComment, comments, InsertAnalytics, analytics, pageViews } from "../drizzle/schema";
import { InsertSocialMediaShare, InsertSocialMediaCredential, socialMediaShares, socialMediaCredentials } from "../drizzle/schema";
import { eq, gt, desc, sql } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

// ==================== COMMENTS ====================
export async function createComment(data: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(comments).values(data);
  return result[0].insertId;
}

export async function getCommentsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.postId, postId)).orderBy(comments.createdAt);
}

export async function getCommentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
  return result[0];
}

export async function updateCommentStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(comments).set({ status }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(comments).where(eq(comments.id, id));
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.status, 'pending')).orderBy(comments.createdAt);
}

// ==================== ANALYTICS ====================
export async function recordPageView(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pageViews).values(data);
  
  // Update or create analytics record
  const existing = await db.select().from(analytics).where(eq(analytics.postId, data.postId)).limit(1);
  if (existing.length > 0) {
    await db.update(analytics)
      .set({
        viewCount: sql`viewCount + 1`,
        lastViewedAt: new Date(),
      })
      .where(eq(analytics.postId, data.postId));
  } else {
    await db.insert(analytics).values({
      postId: data.postId,
      viewCount: 1,
      uniqueVisitors: 1,
      lastViewedAt: new Date(),
    });
  }
}

export async function getPostAnalytics(postId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(analytics).where(eq(analytics.postId, postId)).limit(1);
  return result[0];
}

export async function getTopPosts(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analytics).orderBy(desc(analytics.viewCount)).limit(limit);
}

export async function getAnalyticsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageViews)
    .where(sql`${pageViews.viewedAt} BETWEEN ${startDate} AND ${endDate}`)
    .orderBy(desc(pageViews.viewedAt));
}

export async function getPostViewsLastDays(days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return db.select({
    postId: pageViews.postId,
    viewCount: sql<number>`COUNT(*) as viewCount`,
    date: sql<string>`DATE(${pageViews.viewedAt}) as date`,
  })
  .from(pageViews)
  .where(gt(pageViews.viewedAt, startDate))
  .groupBy(pageViews.postId, sql`DATE(${pageViews.viewedAt})`)
  .orderBy(desc(sql`DATE(${pageViews.viewedAt})`));
}

// Social Media Functions
// Social Media Functions
export async function saveSocialMediaCredential(
  platform: string,
  accessToken: string,
  refreshToken?: string | null,
  expiresAt?: number | null,
  pageId?: string | null,
  accountId?: string | null
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return db.insert(socialMediaCredentials)
    .values({
      platform,
      accessToken,
      refreshToken: refreshToken || null,
      expiresAt: expiresAt || null,
      pageId: pageId || null,
      accountId: accountId || null,
    });
}

export async function getSocialMediaCredential(platform: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return db.select()
    .from(socialMediaCredentials)
    .where(eq(socialMediaCredentials.platform, platform))
    .limit(1)
    .then(rows => rows[0] || null);
}

export async function recordSocialMediaShare(
  postId: number,
  platform: string,
  sharedUrl?: string | null,
  status: string = 'pending',
  errorMessage?: string | null
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return db.insert(socialMediaShares)
    .values({
      postId,
      platform,
      sharedUrl: sharedUrl || null,
      status,
      errorMessage: errorMessage || null,
    });
}

export async function getSocialMediaShares(postId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return db.select()
    .from(socialMediaShares)
    .where(eq(socialMediaShares.postId, postId))
    .orderBy(desc(socialMediaShares.createdAt));
}

export async function updateSocialMediaShareStatus(
  shareId: number,
  status: string,
  sharedUrl?: string | null,
  errorMessage?: string | null
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return db.update(socialMediaShares)
    .set({
      status,
      sharedUrl: sharedUrl || null,
      errorMessage: errorMessage || null,
    })
    .where(eq(socialMediaShares.id, shareId));
}

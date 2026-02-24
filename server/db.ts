import { eq, like, or, desc, asc, and, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  categories, InsertCategory,
  tags, InsertTag,
  posts, InsertPost,
  postTags, InsertPostTag,
  pages, InsertPage,
  banners, InsertBanner,
  videos, InsertVideo,
  transparencyItems, InsertTransparencyItem,
  units, InsertUnit,
  siteConfig, InsertSiteConfig,
} from "../drizzle/schema";
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

// ==================== USERS ====================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
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
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CATEGORIES ====================
export async function listCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(categories).values(data);
  return result[0].insertId;
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ==================== TAGS ====================
export async function listTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).orderBy(asc(tags.name));
}

export async function createTag(data: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(tags).values(data);
  return result[0].insertId;
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(postTags).where(eq(postTags.tagId, id));
  await db.delete(tags).where(eq(tags.id, id));
}

// ==================== POSTS ====================
export async function listPosts(opts: { status?: string; categoryId?: number; limit?: number; offset?: number; search?: string; featured?: boolean } = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const conditions = [];
  if (opts.status) conditions.push(eq(posts.status, opts.status as any));
  if (opts.categoryId) conditions.push(eq(posts.categoryId, opts.categoryId));
  if (opts.featured) conditions.push(eq(posts.isFeatured, true));
  if (opts.search) conditions.push(or(like(posts.title, `%${opts.search}%`), like(posts.content, `%${opts.search}%`)));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [items, countResult] = await Promise.all([
    db.select().from(posts).where(where).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).limit(opts.limit ?? 20).offset(opts.offset ?? 0),
    db.select({ count: sql<number>`count(*)` }).from(posts).where(where),
  ]);
  return { items, total: countResult[0]?.count ?? 0 };
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0];
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(posts).values(data);
  return result[0].insertId;
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(postTags).where(eq(postTags.postId, id));
  await db.delete(posts).where(eq(posts.id, id));
}

export async function incrementPostViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set({ viewCount: sql`${posts.viewCount} + 1` }).where(eq(posts.id, id));
}

// ==================== POST TAGS ====================
export async function setPostTags(postId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(postTags).where(eq(postTags.postId, postId));
  if (tagIds.length > 0) {
    await db.insert(postTags).values(tagIds.map(tagId => ({ postId, tagId })));
  }
}

export async function getPostTags(postId: number) {
  const db = await getDb();
  if (!db) return [];
  const pts = await db.select().from(postTags).where(eq(postTags.postId, postId));
  if (pts.length === 0) return [];
  const tagIds = pts.map(pt => pt.tagId);
  return db.select().from(tags).where(inArray(tags.id, tagIds));
}

// ==================== PAGES ====================
export async function listPages(opts: { status?: string; showInMenu?: boolean } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts.status) conditions.push(eq(pages.status, opts.status as any));
  if (opts.showInMenu !== undefined) conditions.push(eq(pages.showInMenu, opts.showInMenu));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(pages).where(where).orderBy(asc(pages.sortOrder));
}

export async function getPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0];
}

export async function createPage(data: InsertPage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(pages).values(data);
  return result[0].insertId;
}

export async function updatePage(id: number, data: Partial<InsertPage>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(pages).set(data).where(eq(pages.id, id));
}

export async function deletePage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(pages).where(eq(pages.id, id));
}

// ==================== BANNERS ====================
export async function listBanners(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  const where = activeOnly ? eq(banners.isActive, true) : undefined;
  return db.select().from(banners).where(where).orderBy(asc(banners.sortOrder));
}

export async function createBanner(data: InsertBanner) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(banners).values(data);
  return result[0].insertId;
}

export async function updateBanner(id: number, data: Partial<InsertBanner>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(banners).set(data).where(eq(banners.id, id));
}

export async function deleteBanner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(banners).where(eq(banners.id, id));
}

// ==================== VIDEOS ====================
export async function listVideos(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  const where = activeOnly ? eq(videos.isActive, true) : undefined;
  return db.select().from(videos).where(where).orderBy(asc(videos.sortOrder));
}

export async function createVideo(data: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(videos).values(data);
  return result[0].insertId;
}

export async function updateVideo(id: number, data: Partial<InsertVideo>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(videos).set(data).where(eq(videos.id, id));
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(videos).where(eq(videos.id, id));
}

// ==================== TRANSPARENCY ====================
export async function listTransparencyItems(section?: string) {
  const db = await getDb();
  if (!db) return [];
  const where = section ? and(eq(transparencyItems.section, section), eq(transparencyItems.isActive, true)) : eq(transparencyItems.isActive, true);
  return db.select().from(transparencyItems).where(where).orderBy(asc(transparencyItems.sortOrder));
}

export async function createTransparencyItem(data: InsertTransparencyItem) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(transparencyItems).values(data);
  return result[0].insertId;
}

export async function updateTransparencyItem(id: number, data: Partial<InsertTransparencyItem>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(transparencyItems).set(data).where(eq(transparencyItems.id, id));
}

export async function deleteTransparencyItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(transparencyItems).where(eq(transparencyItems.id, id));
}

// ==================== UNITS ====================
export async function listUnits(type?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(units.isActive, true)];
  if (type) conditions.push(eq(units.type, type as any));
  return db.select().from(units).where(and(...conditions)).orderBy(asc(units.sortOrder), asc(units.name));
}

export async function createUnit(data: InsertUnit) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(units).values(data);
  return result[0].insertId;
}

export async function updateUnit(id: number, data: Partial<InsertUnit>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(units).set(data).where(eq(units.id, id));
}

export async function deleteUnit(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(units).where(eq(units.id, id));
}

// ==================== SITE CONFIG ====================
export async function getSiteConfig(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.configKey, key)).limit(1);
  return result[0]?.configValue;
}

export async function setSiteConfig(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(siteConfig).values({ configKey: key, configValue: value, description }).onDuplicateKeyUpdate({ set: { configValue: value } });
}

export async function getAllSiteConfig() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteConfig);
}

// ==================== SEARCH ====================
export async function searchContent(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return { posts: [], pages: [] };
  const searchTerm = `%${query}%`;
  const [postResults, pageResults] = await Promise.all([
    db.select().from(posts).where(and(eq(posts.status, "published"), or(like(posts.title, searchTerm), like(posts.content, searchTerm)))).orderBy(desc(posts.publishedAt)).limit(limit),
    db.select().from(pages).where(and(eq(pages.status, "published"), or(like(pages.title, searchTerm), like(pages.content, searchTerm)))).orderBy(asc(pages.sortOrder)).limit(limit),
  ]);
  return { posts: postResults, pages: pageResults };
}

// ==================== USERS MANAGEMENT ====================
export async function listUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(users.createdAt);
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(id: number, role: string, categoryId?: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(users).set({ role: role as any, categoryId }).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(users).where(eq(users.id, id));
}

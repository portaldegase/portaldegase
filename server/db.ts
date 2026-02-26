import { eq, like, or, desc, asc, and, sql, inArray, ilike, gte } from "drizzle-orm";
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
  postHistory, InsertPostHistory,
  pageHistory, InsertPageHistory,
  comments, InsertComment,
  mediaLibrary, InsertMediaLibrary,
  colorThemes, InsertColorTheme,
  services, InsertService,
  serviceAnalytics, InsertServiceAnalytics,
  serviceClickLog, InsertServiceClickLog,
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
  if (opts.search) {
    const searchLower = opts.search.toLowerCase();
    conditions.push(or(
      ilike(posts.title, `%${searchLower}%`),
      ilike(posts.content, `%${searchLower}%`)
    ));
  }
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
  const postId = result[0].insertId;
  // Retornar o post criado
  const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return post[0];
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
  // Retornar o post atualizado
  const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post[0];
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

export async function getPageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  return result[0];
}

export async function createPage(data: InsertPage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(pages).values(data);
  const pageId = result[0].insertId as number;
  const page = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  return page[0];
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
  const searchLower = query.toLowerCase();
  const searchTerm = `%${searchLower}%`;
  const [postResults, pageResults] = await Promise.all([
    db.select().from(posts).where(and(eq(posts.status, "published"), or(ilike(posts.title, searchTerm), ilike(posts.content, searchTerm)))).orderBy(desc(posts.publishedAt)).limit(limit),
    db.select().from(pages).where(and(eq(pages.status, "published"), or(ilike(pages.title, searchTerm), ilike(pages.content, searchTerm)))).orderBy(asc(pages.sortOrder)).limit(limit),
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

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(users).where(eq(users.id, id));
}


// ===== POST HISTORY FUNCTIONS =====

export async function createPostHistory(
  postId: number,
  post: Omit<InsertPostHistory, 'postId'>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(postHistory).values({
    ...post,
    postId,
  } as InsertPostHistory);
}

export async function getPostHistory(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(postHistory)
    .where(eq(postHistory.postId, postId))
    .orderBy(desc(postHistory.createdAt));
}

export async function getPostHistoryById(historyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(postHistory)
    .where(eq(postHistory.id, historyId))
    .limit(1);

  return result[0];
}

export async function revertPostToVersion(postId: number, historyId: number, editorId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the version to revert to
  const version = await getPostHistoryById(historyId);
  if (!version || version.postId !== postId) {
    throw new Error("Version not found");
  }

  // Create a new history entry before reverting (backup current state)
  const currentPost = await getPostById(postId);
  if (currentPost) {
    await createPostHistory(postId, {
      title: currentPost.title,
      excerpt: currentPost.excerpt,
      content: currentPost.content,
      featuredImage: currentPost.featuredImage,
      status: currentPost.status,
      isFeatured: currentPost.isFeatured,
      editorId,
      changeDescription: `Revertido para versão de ${version.createdAt.toLocaleDateString("pt-BR")}`,
    });
  }

  // Revert the post to the selected version
  await db.update(posts).set({
    title: version.title,
    excerpt: version.excerpt,
    content: version.content,
    featuredImage: version.featuredImage,
    status: version.status,
    isFeatured: version.isFeatured,
    updatedAt: new Date(),
  }).where(eq(posts.id, postId));
}

// ===== PAGE HISTORY FUNCTIONS =====

export async function createPageHistory(
  pageId: number,
  page: Omit<InsertPageHistory, 'pageId'>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(pageHistory).values({
    ...page,
    pageId,
  } as InsertPageHistory);
}

export async function getPageHistory(pageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(pageHistory)
    .where(eq(pageHistory.pageId, pageId))
    .orderBy(desc(pageHistory.createdAt));
}

export async function getPageHistoryById(historyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pageHistory)
    .where(eq(pageHistory.id, historyId))
    .limit(1);

  return result[0];
}

export async function revertPageToVersion(pageId: number, historyId: number, editorId?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the version to revert to
  const version = await getPageHistoryById(historyId);
  if (!version || version.pageId !== pageId) {
    throw new Error("Version not found");
  }

  // Create a new history entry before reverting (backup current state)
  const currentPage = await getPageById(pageId);
  if (currentPage) {
    await createPageHistory(pageId, {
      title: currentPage.title,
      content: currentPage.content,
      excerpt: currentPage.excerpt,
      featuredImage: currentPage.featuredImage,
      status: currentPage.status,
      menuLabel: currentPage.menuLabel,
      showInMenu: currentPage.showInMenu,
      editorId,
      changeDescription: `Revertido para versão de ${version.createdAt.toLocaleDateString("pt-BR")}`,
    });
  }

  // Revert the page to the selected version
  await db.update(pages).set({
    title: version.title,
    content: version.content,
    excerpt: version.excerpt,
    featuredImage: version.featuredImage,
    status: version.status,
    menuLabel: version.menuLabel,
    showInMenu: version.showInMenu,
    updatedAt: new Date(),
  }).where(eq(pages.id, pageId));
}


// ==================== AGENDAMENTO DE POSTS ====================
export async function schedulePost(postId: number, scheduledAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(posts).set({
    status: 'scheduled',
    scheduledAt,
    isScheduled: true,
    updatedAt: new Date(),
  }).where(eq(posts.id, postId));
}

export async function getScheduledPosts() {
  const db = await getDb();
  if (!db) return [];
  
  // Retorna posts agendados cuja data de publicação é menor ou igual a agora
  return db.select().from(posts).where(
    and(
      eq(posts.status, 'scheduled'),
      eq(posts.isScheduled, true),
      sql`${posts.scheduledAt} <= NOW()`
    )
  ).orderBy(asc(posts.scheduledAt));
}

export async function publishScheduledPost(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(posts).set({
    status: 'published',
    publishedAt: new Date(),
    isScheduled: false,
    updatedAt: new Date(),
  }).where(eq(posts.id, postId));
}

export async function cancelScheduledPost(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(posts).set({
    status: 'draft',
    scheduledAt: null,
    isScheduled: false,
    updatedAt: new Date(),
  }).where(eq(posts.id, postId));
}

export async function getScheduledPostsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts).where(
    and(
      eq(posts.authorId, userId),
      eq(posts.isScheduled, true)
    )
  ).orderBy(asc(posts.scheduledAt));
}


// ==================== TEMAS DE CORES ====================
export async function createColorTheme(theme: InsertColorTheme) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  const result = await db.insert(colorThemes).values(theme);
  return result;
}

export async function getColorThemes() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(colorThemes).orderBy(desc(colorThemes.createdAt));
}

export async function getActiveColorTheme() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(colorThemes).where(eq(colorThemes.isActive, true)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateColorTheme(id: number, theme: Partial<InsertColorTheme>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(colorThemes).set({
    ...theme,
    updatedAt: new Date(),
  }).where(eq(colorThemes.id, id));
}

export async function activateColorTheme(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  // Desativar todos os outros temas
  await db.update(colorThemes).set({ isActive: false });
  
  // Ativar o tema selecionado
  await db.update(colorThemes).set({ isActive: true }).where(eq(colorThemes.id, id));
}

export async function deleteColorTheme(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.delete(colorThemes).where(eq(colorThemes.id, id));
}


// ==================== COMENTÁRIOS ====================
export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  const result = await db.insert(comments).values(comment);
  return result;
}

export async function getPostComments(postId: number, onlyApproved = true) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(comments.postId, postId)];
  if (onlyApproved) {
    conditions.push(eq(comments.status, 'approved'));
  }
  return db.select().from(comments).where(and(...conditions)).orderBy(desc(comments.createdAt));
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(comments).where(eq(comments.status, 'pending')).orderBy(desc(comments.createdAt));
}

export async function updateCommentStatus(id: number, status: 'approved' | 'rejected' | 'spam', moderatedBy: number, reason?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(comments).set({
    status,
    moderatedBy,
    moderationReason: reason,
    updatedAt: new Date(),
  }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.delete(comments).where(eq(comments.id, id));
}

// ==================== MÍDIA ====================
export async function createMediaItem(media: InsertMediaLibrary) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  const result = await db.insert(mediaLibrary).values(media);
  return result;
}

export async function getMediaLibrary(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt)).limit(limit).offset(offset);
}

export async function getMediaByType(fileType: 'image' | 'video', limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(mediaLibrary).where(eq(mediaLibrary.fileType, fileType)).orderBy(desc(mediaLibrary.createdAt)).limit(limit).offset(offset);
}

export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(mediaLibrary).where(eq(mediaLibrary.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateMediaItem(id: number, media: Partial<InsertMediaLibrary>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(mediaLibrary).set({
    ...media,
    updatedAt: new Date(),
  }).where(eq(mediaLibrary.id, id));
}

export async function deleteMediaItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
}


// ==================== BUSCA ====================
export async function searchPosts(query: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const searchLower = query.toLowerCase();
  const searchTerm = `%${searchLower}%`;
  return db.select().from(posts)
    .where(
      and(
        or(
          ilike(posts.title, searchTerm),
          ilike(posts.content, searchTerm),
          ilike(posts.excerpt, searchTerm)
        ),
        eq(posts.status, 'published')
      )
    )
    .limit(limit)
    .orderBy(desc(posts.createdAt));
}


export async function addTagToPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.insert(postTags).values({ postId, tagId }).onDuplicateKeyUpdate({ set: {} });
}

export async function removeTagFromPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.delete(postTags).where(and(eq(postTags.postId, postId), eq(postTags.tagId, tagId)));
}


export async function getPostsByTag(tagId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({ post: posts }).from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tagId), eq(posts.status, 'published')))
    .limit(limit)
    .orderBy(desc(posts.createdAt));
  
  return result.map(r => r.post);
}


// ==================== SERVIÇOS ====================
export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  const result = await db.insert(services).values(service);
  return result;
}

export async function listServices(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  
  const query = db.select().from(services).orderBy(asc(services.sortOrder));
  if (activeOnly) {
    return query.where(eq(services.isActive, true));
  }
  return query;
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateService(id: number, service: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.update(services).set({
    ...service,
    updatedAt: new Date(),
  }).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.delete(services).where(eq(services.id, id));
}


// ==================== SERVICE ANALYTICS ====================
export async function recordServiceClick(serviceId: number, userAgent?: string, referer?: string, ipAddress?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  // Registrar click no log detalhado
  await db.insert(serviceClickLog).values({
    serviceId,
    userAgent,
    referer,
    ipAddress,
  });
  
  // Atualizar ou criar registro de analytics
  const existing = await db.select().from(serviceAnalytics).where(eq(serviceAnalytics.serviceId, serviceId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(serviceAnalytics)
      .set({
        clickCount: (existing[0].clickCount || 0) + 1,
        lastClickedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(serviceAnalytics.serviceId, serviceId));
  } else {
    await db.insert(serviceAnalytics).values({
      serviceId,
      clickCount: 1,
      lastClickedAt: new Date(),
    });
  }
}

export async function getServiceAnalytics(serviceId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(serviceAnalytics).where(eq(serviceAnalytics.serviceId, serviceId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllServicesAnalytics() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    service: services,
    analytics: serviceAnalytics,
  })
  .from(services)
  .leftJoin(serviceAnalytics, eq(services.id, serviceAnalytics.serviceId))
  .orderBy(desc(serviceAnalytics.clickCount));
}

export async function getServiceClickStats(serviceId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const analytics = await getServiceAnalytics(serviceId);
  if (!analytics) return null;
  
  // Contar clicks nos últimos 7 dias
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentClicks = await db.select({ count: sql`COUNT(*)` })
    .from(serviceClickLog)
    .where(and(
      eq(serviceClickLog.serviceId, serviceId),
      gte(serviceClickLog.clickedAt, sevenDaysAgo)
    ));
  
  return {
    totalClicks: analytics.clickCount,
    recentClicks: recentClicks[0]?.count || 0,
    lastClickedAt: analytics.lastClickedAt,
  };
}

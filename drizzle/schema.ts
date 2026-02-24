import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "contributor"]).default("user").notNull(),
  categoryId: int("categoryId"), // Para contributors: categoria que podem editar
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for organizing content (notícias, comunicados, legislação, etc.)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }),
  icon: varchar("icon", { length: 64 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Tags for content classification
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Posts - main content table (notícias, comunicados, etc.)
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  categoryId: int("categoryId"),
  authorId: int("authorId"),
  status: mysqlEnum("status", ["draft", "published", "archived", "scheduled"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  scheduledAt: timestamp("scheduledAt"), // Data/hora agendada para publicação
  isScheduled: boolean("isScheduled").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Post-Tag relationship (many-to-many)
 */
export const postTags = mysqlTable("post_tags", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
});

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;

/**
 * Institutional pages (Sobre, Serviços, Legislação, etc.)
 */
export const pages = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"),
  parentId: int("parentId"),
  sortOrder: int("sortOrder").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  showInMenu: boolean("showInMenu").default(false).notNull(),
  menuLabel: varchar("menuLabel", { length: 128 }),
  authorId: int("authorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

/**
 * Banners for homepage carousel
 */
export const banners = mysqlTable("banners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("imageUrl").notNull(),
  linkUrl: text("linkUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = typeof banners.$inferInsert;

/**
 * Videos (YouTube embeds)
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  youtubeUrl: text("youtubeUrl").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnailUrl"),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Transparency documents and links
 */
export const transparencyItems = mysqlTable("transparency_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  linkUrl: text("linkUrl"),
  icon: varchar("icon", { length: 64 }),
  section: varchar("section", { length: 128 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TransparencyItem = typeof transparencyItems.$inferSelect;
export type InsertTransparencyItem = typeof transparencyItems.$inferInsert;

/**
 * DEGASE units (unidades)
 */
export const units = mysqlTable("units", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["internacao", "internacao_provisoria", "semiliberdade", "meio_aberto"]).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 320 }),
  visitDays: text("visitDays"),
  mapsUrl: text("mapsUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;

/**
 * Site configuration (key-value store)
 */
export const siteConfig = mysqlTable("site_config", {
  id: int("id").autoincrement().primaryKey(),
  configKey: varchar("configKey", { length: 128 }).notNull().unique(),
  configValue: text("configValue"),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = typeof siteConfig.$inferInsert;

/**
 * Post version history - tracks all changes to posts
 */
export const postHistory = mysqlTable("post_history", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  editorId: int("editorId"),
  changeDescription: varchar("changeDescription", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostHistory = typeof postHistory.$inferSelect;
export type InsertPostHistory = typeof postHistory.$inferInsert;

/**
 * Page version history - tracks all changes to pages
 */
export const pageHistory = mysqlTable("page_history", {
  id: int("id").autoincrement().primaryKey(),
  pageId: int("pageId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  menuLabel: varchar("menuLabel", { length: 255 }),
  showInMenu: boolean("showInMenu").default(false).notNull(),
  editorId: int("editorId"),
  changeDescription: varchar("changeDescription", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageHistory = typeof pageHistory.$inferSelect;
export type InsertPageHistory = typeof pageHistory.$inferInsert;


/**
 * Temas/Esquemas de cores do portal
 */
export const colorThemes = mysqlTable("color_themes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  // Cores principais
  primaryColor: varchar("primaryColor", { length: 7 }).default("#003366").notNull(), // Azul DEGASE
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#D4AF37").notNull(), // Dourado
  accentColor: varchar("accentColor", { length: 7 }).default("#0066CC").notNull(), // Azul claro
  // Cores de texto
  textColor: varchar("textColor", { length: 7 }).default("#333333").notNull(),
  textLightColor: varchar("textLightColor", { length: 7 }).default("#666666").notNull(),
  // Cores de fundo
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#FFFFFF").notNull(),
  surfaceColor: varchar("surfaceColor", { length: 7 }).default("#F5F5F5").notNull(),
  // Cores de busca
  searchBgColor: varchar("searchBgColor", { length: 7 }).default("#003366").notNull(),
  searchTextColor: varchar("searchTextColor", { length: 7 }).default("#FFFFFF").notNull(),
  searchBorderColor: varchar("searchBorderColor", { length: 7 }).default("#D4AF37").notNull(),
  // Status
  isActive: boolean("isActive").default(false).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ColorTheme = typeof colorThemes.$inferSelect;
export type InsertColorTheme = typeof colorThemes.$inferInsert;


/**
 * Comentários em notícias
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "spam"]).default("pending").notNull(),
  moderatedBy: int("moderatedBy"), // ID do usuário que moderou
  moderationReason: text("moderationReason"), // Motivo da rejeição
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Galeria de mídia (imagens e vídeos)
 */
export const mediaLibrary = mysqlTable("media_library", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: text("url").notNull(), // URL do S3
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // Chave do arquivo no S3
  fileType: mysqlEnum("fileType", ["image", "video"]).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileSize: int("fileSize"), // Tamanho em bytes
  width: int("width"), // Para imagens
  height: int("height"), // Para imagens
  duration: int("duration"), // Para vídeos em segundos
  uploadedBy: int("uploadedBy").notNull(), // ID do usuário que fez upload
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MediaLibrary = typeof mediaLibrary.$inferSelect;
export type InsertMediaLibrary = typeof mediaLibrary.$inferInsert;


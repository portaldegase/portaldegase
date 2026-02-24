import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
  return next({ ctx });
});

// Editor procedure (admin or user)
const editorProcedure = protectedProcedure;

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== CATEGORIES ====================
  categories: router({
    list: publicProcedure.query(async () => db.listCategories()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => db.getCategoryBySlug(input.slug)),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      slug: z.string().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const slug = input.slug || slugify(input.name);
      return db.createCategory({ ...input, slug });
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateCategory(id, data);
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteCategory(input.id)),
  }),

  // ==================== TAGS ====================
  tags: router({
    list: publicProcedure.query(async () => db.listTags()),
    create: editorProcedure.input(z.object({
      name: z.string().min(1),
      slug: z.string().optional(),
    })).mutation(async ({ input }) => {
      const slug = input.slug || slugify(input.name);
      return db.createTag({ ...input, slug });
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteTag(input.id)),
  }),

  // ==================== POSTS ====================
  posts: router({
    list: publicProcedure.input(z.object({
      status: z.string().optional(),
      categoryId: z.number().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      search: z.string().optional(),
      featured: z.boolean().optional(),
    }).optional()).query(async ({ input }) => db.listPosts(input ?? {})),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const post = await db.getPostBySlug(input.slug);
      if (post) await db.incrementPostViews(post.id);
      return post;
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => db.getPostById(input.id)),

    getTags: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => db.getPostTags(input.postId)),

    create: editorProcedure.input(z.object({
      title: z.string().min(1),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().min(1),
      featuredImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      isFeatured: z.boolean().optional(),
      tagIds: z.array(z.number()).optional(),
    })).mutation(async ({ input, ctx }) => {
      const slug = input.slug || slugify(input.title);
      const { tagIds, ...postData } = input;
      const publishedAt = input.status === "published" ? new Date() : undefined;
      const id = await db.createPost({ ...postData, slug, authorId: ctx.user.id, publishedAt });
      if (tagIds && tagIds.length > 0) await db.setPostTags(id, tagIds);
      return id;
    }),

    update: editorProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      isFeatured: z.boolean().optional(),
      tagIds: z.array(z.number()).optional(),
    })).mutation(async ({ input }) => {
      const { id, tagIds, ...data } = input;
      if (data.status === "published") {
        const existing = await db.getPostById(id);
        if (existing && !existing.publishedAt) (data as any).publishedAt = new Date();
      }
      await db.updatePost(id, data);
      if (tagIds !== undefined) await db.setPostTags(id, tagIds);
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deletePost(input.id)),
  }),

  // ==================== PAGES ====================
  pages: router({
    list: publicProcedure.input(z.object({
      status: z.string().optional(),
      showInMenu: z.boolean().optional(),
    }).optional()).query(async ({ input }) => db.listPages(input ?? {})),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => db.getPageBySlug(input.slug)),

    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      slug: z.string().optional(),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      parentId: z.number().optional(),
      sortOrder: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      showInMenu: z.boolean().optional(),
      menuLabel: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const slug = input.slug || slugify(input.title);
      return db.createPage({ ...input, slug, authorId: ctx.user.id });
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      parentId: z.number().optional(),
      sortOrder: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      showInMenu: z.boolean().optional(),
      menuLabel: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updatePage(id, data);
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deletePage(input.id)),
  }),

  // ==================== BANNERS ====================
  banners: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => db.listBanners(input?.activeOnly ?? false)),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      imageUrl: z.string().min(1),
      linkUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => db.createBanner(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      imageUrl: z.string().optional(),
      linkUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => { const { id, ...data } = input; return db.updateBanner(id, data); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteBanner(input.id)),
  }),

  // ==================== VIDEOS ====================
  videos: router({
    list: publicProcedure.input(z.object({ activeOnly: z.boolean().optional() }).optional()).query(async ({ input }) => db.listVideos(input?.activeOnly ?? false)),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      youtubeUrl: z.string().min(1),
      description: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      isFeatured: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => db.createVideo(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      youtubeUrl: z.string().optional(),
      description: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => { const { id, ...data } = input; return db.updateVideo(id, data); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteVideo(input.id)),
  }),

  // ==================== TRANSPARENCY ====================
  transparency: router({
    list: publicProcedure.input(z.object({ section: z.string().optional() }).optional()).query(async ({ input }) => db.listTransparencyItems(input?.section)),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      linkUrl: z.string().optional(),
      icon: z.string().optional(),
      section: z.string().min(1),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => db.createTransparencyItem(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      linkUrl: z.string().optional(),
      icon: z.string().optional(),
      section: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => { const { id, ...data } = input; return db.updateTransparencyItem(id, data); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteTransparencyItem(input.id)),
  }),

  // ==================== UNITS ====================
  units: router({
    list: publicProcedure.input(z.object({ type: z.string().optional() }).optional()).query(async ({ input }) => db.listUnits(input?.type)),
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      type: z.enum(["internacao", "internacao_provisoria", "semiliberdade", "meio_aberto"]),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      visitDays: z.string().optional(),
      mapsUrl: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => db.createUnit(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      type: z.enum(["internacao", "internacao_provisoria", "semiliberdade", "meio_aberto"]).optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      visitDays: z.string().optional(),
      mapsUrl: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => { const { id, ...data } = input; return db.updateUnit(id, data); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => db.deleteUnit(input.id)),
  }),

  // ==================== SITE CONFIG ====================
  config: router({
    get: publicProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => db.getSiteConfig(input.key)),
    getAll: publicProcedure.query(async () => db.getAllSiteConfig()),
    set: adminProcedure.input(z.object({
      key: z.string().min(1),
      value: z.string(),
      description: z.string().optional(),
    })).mutation(async ({ input }) => db.setSiteConfig(input.key, input.value, input.description)),
  }),

  // ==================== SEARCH ====================
  search: router({
    query: publicProcedure.input(z.object({ q: z.string().min(1), limit: z.number().optional() })).query(async ({ input }) => db.searchContent(input.q, input.limit)),
  }),

  // ==================== UPLOAD ====================
  upload: router({
    image: editorProcedure.input(z.object({
      file: z.instanceof(Buffer),
      filename: z.string(),
      mimetype: z.string(),
    })).mutation(async ({ input }) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimes.includes(input.mimetype)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Tipo de arquivo nao permitido. Use JPEG, PNG, WebP ou GIF.' });
      }
      const maxSize = 5 * 1024 * 1024;
      if (input.file.length > maxSize) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Arquivo muito grande. Maximo 5MB.' });
      }
      try {
        const { storagePut } = await import('./storage');
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const ext = input.filename.split('.').pop() || 'jpg';
        const fileKey = `degase-cms/images/${timestamp}-${randomStr}.${ext}`;
        const { url } = await storagePut(fileKey, input.file, input.mimetype);
        return { url, success: true };
      } catch (error) {
        console.error('[Upload] Erro ao fazer upload:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao fazer upload da imagem' });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

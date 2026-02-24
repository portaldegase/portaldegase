import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  listCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Notícias", slug: "noticias", description: "Notícias gerais", color: "#003366", icon: null, sortOrder: 0, isActive: true },
    { id: 2, name: "Comunicados", slug: "comunicados", description: "Comunicados oficiais", color: "#0066CC", icon: null, sortOrder: 1, isActive: true },
  ]),
  getCategoryBySlug: vi.fn().mockResolvedValue({ id: 1, name: "Notícias", slug: "noticias" }),
  createCategory: vi.fn().mockResolvedValue(3),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(undefined),
  listTags: vi.fn().mockResolvedValue([
    { id: 1, name: "Socioeducação", slug: "socioeducacao" },
    { id: 2, name: "Capacitação", slug: "capacitacao" },
  ]),
  createTag: vi.fn().mockResolvedValue(3),
  deleteTag: vi.fn().mockResolvedValue(undefined),
  listPosts: vi.fn().mockResolvedValue({
    items: [
      { id: 1, title: "Notícia Teste", slug: "noticia-teste", excerpt: "Resumo", content: "<p>Conteúdo</p>", status: "published", publishedAt: new Date(), viewCount: 10, isFeatured: false, categoryId: 1, authorId: 1 },
    ],
    total: 1,
  }),
  getPostBySlug: vi.fn().mockResolvedValue({
    id: 1, title: "Notícia Teste", slug: "noticia-teste", content: "<p>Conteúdo</p>", status: "published", viewCount: 10,
  }),
  getPostById: vi.fn().mockResolvedValue({
    id: 1, title: "Notícia Teste", slug: "noticia-teste", content: "<p>Conteúdo</p>", status: "published", publishedAt: null,
  }),
  getPostTags: vi.fn().mockResolvedValue([{ id: 1, name: "Socioeducação", slug: "socioeducacao" }]),
  createPost: vi.fn().mockResolvedValue(2),
  updatePost: vi.fn().mockResolvedValue(undefined),
  deletePost: vi.fn().mockResolvedValue(undefined),
  incrementPostViews: vi.fn().mockResolvedValue(undefined),
  setPostTags: vi.fn().mockResolvedValue(undefined),
  listPages: vi.fn().mockResolvedValue([
    { id: 1, title: "Sobre", slug: "sobre", content: "<p>Sobre o DEGASE</p>", status: "published" },
  ]),
  getPageBySlug: vi.fn().mockResolvedValue({ id: 1, title: "Sobre", slug: "sobre", content: "<p>Sobre o DEGASE</p>" }),
  createPage: vi.fn().mockResolvedValue(2),
  updatePage: vi.fn().mockResolvedValue(undefined),
  deletePage: vi.fn().mockResolvedValue(undefined),
  listBanners: vi.fn().mockResolvedValue([
    { id: 1, title: "Banner EGSE", imageUrl: "/banner.jpg", isActive: true },
  ]),
  createBanner: vi.fn().mockResolvedValue(2),
  updateBanner: vi.fn().mockResolvedValue(undefined),
  deleteBanner: vi.fn().mockResolvedValue(undefined),
  listVideos: vi.fn().mockResolvedValue([
    { id: 1, title: "TV Degase", youtubeUrl: "https://youtube.com/watch?v=abc", isActive: true },
  ]),
  createVideo: vi.fn().mockResolvedValue(2),
  updateVideo: vi.fn().mockResolvedValue(undefined),
  deleteVideo: vi.fn().mockResolvedValue(undefined),
  listTransparencyItems: vi.fn().mockResolvedValue([
    { id: 1, title: "Institucional", section: "geral", isActive: true },
  ]),
  createTransparencyItem: vi.fn().mockResolvedValue(2),
  updateTransparencyItem: vi.fn().mockResolvedValue(undefined),
  deleteTransparencyItem: vi.fn().mockResolvedValue(undefined),
  listUnits: vi.fn().mockResolvedValue([
    { id: 1, name: "CENSE Dom Bosco", type: "internacao", isActive: true },
  ]),
  createUnit: vi.fn().mockResolvedValue(2),
  updateUnit: vi.fn().mockResolvedValue(undefined),
  deleteUnit: vi.fn().mockResolvedValue(undefined),
  getSiteConfig: vi.fn().mockResolvedValue("DEGASE"),
  getAllSiteConfig: vi.fn().mockResolvedValue([{ id: 1, configKey: "site_name", configValue: "DEGASE" }]),
  setSiteConfig: vi.fn().mockResolvedValue(undefined),
  searchContent: vi.fn().mockResolvedValue({
    posts: [{ id: 1, title: "Resultado", slug: "resultado", content: "<p>Conteúdo</p>", status: "published" }],
    pages: [],
  }),
  createPostHistory: vi.fn().mockResolvedValue(undefined),
  getPostHistory: vi.fn().mockResolvedValue([]),
  getPostHistoryById: vi.fn().mockResolvedValue(null),
  revertPostToVersion: vi.fn().mockResolvedValue(undefined),
  createPageHistory: vi.fn().mockResolvedValue(undefined),
  getPageHistory: vi.fn().mockResolvedValue([]),
  getPageHistoryById: vi.fn().mockResolvedValue(null),
  revertPageToVersion: vi.fn().mockResolvedValue(undefined),
  getPageById: vi.fn().mockResolvedValue({ id: 1, title: "Sobre", slug: "sobre", content: "<p>Sobre o DEGASE</p>" }),
  listUsers: vi.fn().mockResolvedValue([]),
  getUserById: vi.fn().mockResolvedValue(null),
  updateUserRole: vi.fn().mockResolvedValue(undefined),
  deleteUser: vi.fn().mockResolvedValue(undefined),
  searchPosts: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@degase.rj.gov.br",
    name: "Admin DEGASE",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createEditorContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "editor-user",
    email: "editor@degase.rj.gov.br",
    name: "Editor DEGASE",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("CMS - Public Endpoints", () => {
  it("lists categories publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.categories.list();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Notícias");
  });

  it("gets category by slug publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.categories.getBySlug({ slug: "noticias" });
    expect(result?.name).toBe("Notícias");
  });

  it("lists published posts publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.posts.list({ status: "published" });
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("gets post by slug and increments views", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.posts.getBySlug({ slug: "noticia-teste" });
    expect(result?.title).toBe("Notícia Teste");
  });

  it("lists tags publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.tags.list();
    expect(result).toHaveLength(2);
  });

  it("lists banners publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.banners.list({ activeOnly: true });
    expect(result).toHaveLength(1);
  });

  it("lists videos publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.videos.list({ activeOnly: true });
    expect(result).toHaveLength(1);
  });

  it("lists transparency items publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.transparency.list();
    expect(result).toHaveLength(1);
  });

  it("lists units publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.units.list();
    expect(result).toHaveLength(1);
  });

  it("searches content publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.search.query({ q: "degase" });
    expect(result.posts).toHaveLength(1);
  });

  it("gets site config publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.config.get({ key: "site_name" });
    expect(result).toBe("DEGASE");
  });

  it("lists pages publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.pages.list();
    expect(result).toHaveLength(1);
  });
});

describe("CMS - Admin Endpoints", () => {
  it("admin can create a category", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.categories.create({ name: "Nova Categoria" });
    expect(result).toBe(3);
  });

  it("admin can update a category", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.categories.update({ id: 1, name: "Atualizada" });
  });

  it("admin can delete a category", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.categories.delete({ id: 1 });
  });

  it("admin can create a page", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.pages.create({ title: "Nova Página", content: "<p>Conteúdo</p>" });
    expect(result).toBe(2);
  });

  it("admin can create a banner", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.banners.create({ title: "Novo Banner", imageUrl: "/img.jpg" });
    expect(result).toBe(2);
  });

  it("admin can create a video", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.videos.create({ title: "Novo Vídeo", youtubeUrl: "https://youtube.com/watch?v=xyz" });
    expect(result).toBe(2);
  });

  it("admin can create a transparency item", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.transparency.create({ title: "Novo Item", section: "geral" });
    expect(result).toBe(2);
  });

  it("admin can create a unit", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.units.create({ name: "Nova Unidade", type: "internacao" });
    expect(result).toBe(2);
  });

  it("admin can set site config", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.config.set({ key: "site_name", value: "DEGASE RJ" });
  });
});

describe("CMS - Editor (user role) Endpoints", () => {
  it("editor can create a post", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const result = await caller.posts.create({
      title: "Nova Notícia do Editor",
      content: "<p>Conteúdo da notícia</p>",
      status: "draft",
    });
    expect(result).toBe(2);
  });

  it("editor can update a post", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    await caller.posts.update({ id: 1, title: "Título Atualizado" });
  });

  it("editor can create a tag", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const result = await caller.tags.create({ name: "Nova Tag" });
    expect(result).toBe(3);
  });
});

describe("CMS - Access Control", () => {
  it("unauthenticated user cannot create a category", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.categories.create({ name: "Teste" })).rejects.toThrow();
  });

  it("unauthenticated user cannot create a post", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.posts.create({ title: "Teste", content: "<p>x</p>" })).rejects.toThrow();
  });

  it("editor cannot delete a post (admin only)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    await expect(caller.posts.delete({ id: 1 })).rejects.toThrow();
  });

  it("editor cannot create a page (admin only)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    await expect(caller.pages.create({ title: "Teste", content: "<p>x</p>" })).rejects.toThrow();
  });

  it("editor cannot delete a category (admin only)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    await expect(caller.categories.delete({ id: 1 })).rejects.toThrow();
  });

  it("editor cannot create a banner (admin only)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    await expect(caller.banners.create({ title: "Teste", imageUrl: "/x.jpg" })).rejects.toThrow();
  });
});

describe("CMS - Slugify", () => {
  it("auto-generates slug from title when creating a post", async () => {
    const db = await import("./db");
    const caller = appRouter.createCaller(createEditorContext());
    await caller.posts.create({
      title: "Título com Acentuação e Espaços!",
      content: "<p>Conteúdo</p>",
    });
    // Verify createPost was called with a properly slugified slug
    expect(db.createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "titulo-com-acentuacao-e-espacos",
      })
    );
  });
});

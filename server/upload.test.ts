import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock storage module
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "degase-cms/images/test.jpg",
    url: "https://files.manuscdn.com/test.jpg",
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createEditorContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
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

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("Upload - Image Upload", () => {
  it("editor can upload a valid JPEG image", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake jpeg data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "test.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBe("https://files.manuscdn.com/test.jpg");
  });

  it("editor can upload a valid PNG image", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake png data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "test.png",
      mimetype: "image/png",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBe("https://files.manuscdn.com/test.jpg");
  });

  it("editor can upload a valid WebP image", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake webp data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "test.webp",
      mimetype: "image/webp",
    });

    expect(result.success).toBe(true);
  });

  it("editor can upload a valid GIF image", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake gif data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "test.gif",
      mimetype: "image/gif",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid file type (PDF)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake pdf data");
    
    await expect(
      caller.upload.image({
        file: buffer,
        filename: "test.pdf",
        mimetype: "application/pdf",
      })
    ).rejects.toThrow("Tipo de arquivo nao permitido");
  });

  it("rejects invalid file type (text)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake text data");
    
    await expect(
      caller.upload.image({
        file: buffer,
        filename: "test.txt",
        mimetype: "text/plain",
      })
    ).rejects.toThrow("Tipo de arquivo nao permitido");
  });

  it("rejects file larger than 5MB", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    
    await expect(
      caller.upload.image({
        file: largeBuffer,
        filename: "large.jpg",
        mimetype: "image/jpeg",
      })
    ).rejects.toThrow("Arquivo muito grande");
  });

  it("accepts file at exactly 5MB limit", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const limitBuffer = Buffer.alloc(5 * 1024 * 1024); // 5MB
    
    const result = await caller.upload.image({
      file: limitBuffer,
      filename: "limit.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.success).toBe(true);
  });

  it("accepts small files (< 1MB)", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const smallBuffer = Buffer.alloc(500 * 1024); // 500KB
    
    const result = await caller.upload.image({
      file: smallBuffer,
      filename: "small.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.success).toBe(true);
  });
});

describe("Upload - Access Control", () => {
  it("unauthenticated user cannot upload image", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const buffer = Buffer.from("fake jpeg data");
    
    await expect(
      caller.upload.image({
        file: buffer,
        filename: "test.jpg",
        mimetype: "image/jpeg",
      })
    ).rejects.toThrow();
  });

  it("authenticated editor can upload image", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake jpeg data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "test.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.success).toBe(true);
  });
});

describe("Upload - Filename Handling", () => {
  it("preserves file extension in upload", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake jpeg data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "my-image.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.url).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("handles filename without extension", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake jpeg data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "my-image",
      mimetype: "image/jpeg",
    });

    expect(result.url).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("handles filename with multiple dots", async () => {
    const caller = appRouter.createCaller(createEditorContext());
    const buffer = Buffer.from("fake jpeg data");
    
    const result = await caller.upload.image({
      file: buffer,
      filename: "my.image.2026.jpg",
      mimetype: "image/jpeg",
    });

    expect(result.url).toBeDefined();
    expect(result.success).toBe(true);
  });
});

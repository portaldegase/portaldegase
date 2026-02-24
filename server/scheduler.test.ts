import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";
import { publishScheduledPosts } from "./scheduler";

// Mock do módulo db
vi.mock("./db", () => ({
  getScheduledPosts: vi.fn(),
  publishScheduledPost: vi.fn(),
}));

describe("Scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 0 publicados quando não há posts agendados", async () => {
    vi.mocked(db.getScheduledPosts).mockResolvedValue([]);

    const result = await publishScheduledPosts();

    expect(result).toEqual({ published: 0, errors: 0 });
    expect(db.getScheduledPosts).toHaveBeenCalled();
    expect(db.publishScheduledPost).not.toHaveBeenCalled();
  });

  it("deve publicar posts agendados com sucesso", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", status: "scheduled" },
      { id: 2, title: "Post 2", status: "scheduled" },
    ];

    vi.mocked(db.getScheduledPosts).mockResolvedValue(mockPosts as any);
    vi.mocked(db.publishScheduledPost).mockResolvedValue(undefined);

    const result = await publishScheduledPosts();

    expect(result).toEqual({ published: 2, errors: 0 });
    expect(db.publishScheduledPost).toHaveBeenCalledWith(1);
    expect(db.publishScheduledPost).toHaveBeenCalledWith(2);
  });

  it("deve contar erros ao publicar posts", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", status: "scheduled" },
      { id: 2, title: "Post 2", status: "scheduled" },
    ];

    vi.mocked(db.getScheduledPosts).mockResolvedValue(mockPosts as any);
    vi.mocked(db.publishScheduledPost)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Database error"));

    const result = await publishScheduledPosts();

    expect(result).toEqual({ published: 1, errors: 1 });
  });

  it("deve lidar com erro ao buscar posts agendados", async () => {
    vi.mocked(db.getScheduledPosts).mockRejectedValue(new Error("Database error"));

    const result = await publishScheduledPosts();

    expect(result).toEqual({ published: 0, errors: 1 });
  });
});

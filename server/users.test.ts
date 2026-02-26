import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "./db";
import { users, categories } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Users Management", () => {
  let testUserId: number;
  let testCategoryId: number;

  beforeAll(async () => {
    // Create test category
    const [category] = await db
      .insert(categories)
      .values({
        name: "Test Category",
        slug: "test-category",
        isActive: true,
      })
      .returning();
    testCategoryId = category.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
    if (testCategoryId) {
      await db.delete(categories).where(eq(categories.id, testCategoryId));
    }
  });

  it("should create user with functional ID", async () => {
    const [user] = await db
      .insert(users)
      .values({
        openId: `test-user-${Date.now()}`,
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        functionalId: "12345",
        role: "contributor",
        categoryId: testCategoryId,
      })
      .returning();

    testUserId = user.id;

    expect(user.name).toBe("Test User");
    expect(user.functionalId).toBe("12345");
    expect(user.role).toBe("contributor");
    expect(user.categoryId).toBe(testCategoryId);
  });

  it("should update user functional ID", async () => {
    if (!testUserId) {
      throw new Error("Test user not created");
    }

    const [updated] = await db
      .update(users)
      .set({ functionalId: "54321" })
      .where(eq(users.id, testUserId))
      .returning();

    expect(updated.functionalId).toBe("54321");
  });

  it("should update user role and category", async () => {
    if (!testUserId) {
      throw new Error("Test user not created");
    }

    const [updated] = await db
      .update(users)
      .set({ role: "admin", categoryId: null })
      .where(eq(users.id, testUserId))
      .returning();

    expect(updated.role).toBe("admin");
    expect(updated.categoryId).toBeNull();
  });

  it("should retrieve user by ID", async () => {
    if (!testUserId) {
      throw new Error("Test user not created");
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));

    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
    expect(user.name).toBe("Test User");
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from './db';

// Mock the database module
vi.mock('./db', () => ({
  createComment: vi.fn(),
  getCommentsByPostId: vi.fn(),
  getCommentById: vi.fn(),
  updateCommentStatus: vi.fn(),
  deleteComment: vi.fn(),
  getPendingComments: vi.fn(),
}));

describe('Comments System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment with pending status', async () => {
      const mockInsertId = 1;
      vi.mocked(db.createComment).mockResolvedValue(mockInsertId);

      const result = await db.createComment({
        postId: 1,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great post!',
        status: 'pending',
      });

      expect(result).toBe(mockInsertId);
    });
  });

  describe('getCommentsByPostId', () => {
    it('should return comments for a post', async () => {
      const mockComments = [
        {
          id: 1,
          postId: 1,
          authorName: 'John',
          authorEmail: 'john@example.com',
          content: 'Good post',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getCommentsByPostId).mockResolvedValue(mockComments);

      const result = await db.getCommentsByPostId(1);

      expect(result).toEqual(mockComments);
    });
  });

  describe('updateCommentStatus', () => {
    it('should update comment status', async () => {
      vi.mocked(db.updateCommentStatus).mockResolvedValue(undefined);

      await db.updateCommentStatus(1, 'approved');

      expect(db.updateCommentStatus).toHaveBeenCalledWith(1, 'approved');
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      vi.mocked(db.deleteComment).mockResolvedValue(undefined);

      await db.deleteComment(1);

      expect(db.deleteComment).toHaveBeenCalledWith(1);
    });
  });

  describe('getPendingComments', () => {
    it('should return pending comments', async () => {
      const mockPendingComments = [
        {
          id: 1,
          postId: 1,
          authorName: 'Jane',
          authorEmail: 'jane@example.com',
          content: 'Awaiting approval',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getPendingComments).mockResolvedValue(mockPendingComments);

      const result = await db.getPendingComments();

      expect(result).toEqual(mockPendingComments);
    });
  });
});

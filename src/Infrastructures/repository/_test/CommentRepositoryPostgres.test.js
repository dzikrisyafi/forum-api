const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const UserCommentLikesTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewUserCommentLike = require('../../../Domains/comments/entities/NewUserCommentLike');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', date: new Date('2021-01-01').toISOString() });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', date: new Date('2021-01-01').toISOString() });
  });

  afterEach(async () => {
    await UserCommentLikesTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeidGenerator = () => '234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeidGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-234');
      expect(comments).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeidGenerator = () => '234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeidGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-234',
        content: 'sebuah komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('addUserCommentLike function', () => {
    it('should persist new user comment like and return added user comment like correctly', async () => {
      // Arrange
      const newUserCommentLike = new NewUserCommentLike({
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const fakeidGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeidGenerator);

      // Action
      await commentRepositoryPostgres.addUserCommentLike(newUserCommentLike);

      // Assert
      const likes = await UserCommentLikesTestHelper.findUserCommentLikesById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should throw comments by thread id correctly', async () => {
      // Arrange;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toStrictEqual([
        new DetailComment({
          id: 'comment-123',
          username: 'dicoding',
          date: new Date('2021-01-01').toISOString(),
          content: 'isi comment',
          like_count: 0,
          is_delete: false,
        })]);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('deleteUserCommentLike function', () => {
    it('should throw NotFoundError when user comment like not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteUserCommentLike('xx', 'xx')).rejects.toThrowError(NotFoundError);
    });

    it('should delete user comment like correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UserCommentLikesTestHelper.addUserCommentLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });

      // Action
      await commentRepositoryPostgres.deleteUserCommentLike('user-123', 'comment-123');

      // Assert
      const likes = await UserCommentLikesTestHelper.findUserCommentLikesById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('xx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('xx', 'xx')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment owner is not valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should not throw AuthorizationError when comment owner is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyUserCommentLike function', () => {
    it('should throw true when user comment like available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UserCommentLikesTestHelper.addUserCommentLike({ userId: 'user-123', commentId: 'comment-123' });

      // Action
      const like = await commentRepositoryPostgres.verifyUserCommentLike('user-123', 'comment-123');

      // Assert
      expect(like).toBeTruthy();
    });

    it('should throw false when user comment like not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const like = await commentRepositoryPostgres.verifyUserCommentLike('user-123', 'comment-123');

      // Assert
      expect(like).toBeFalsy();
    });
  });
});

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddUserCommentLikeUseCase = require('../AddUserCommentLikeUseCase');

describe('AddUserCommentLikeUseCase', () => {
  it('should orchestrating the add user comment like action correctly when user comment like not available', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyUserCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.addUserCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addUserCommentLikeUseCase = new AddUserCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await addUserCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyUserCommentLike)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockCommentRepository.addUserCommentLike).toBeCalledWith({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
    });
  });

  it('should orchestrating the add user comment like action correctly when user comment like available', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyUserCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.deleteUserCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addUserCommentLikeUseCase = new AddUserCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await addUserCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyUserCommentLike)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockCommentRepository.deleteUserCommentLike)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});

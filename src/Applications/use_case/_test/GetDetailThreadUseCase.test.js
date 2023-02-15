const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = { id: 'thread-123' };
    const date = new Date().toISOString();
    const expectedThread = {
      id: useCasePayload.id,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date,
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          content: 'isi comment',
          date,
          replies: [
            {
              id: 'reply-123',
              content: 'sebuah balasan',
              date,
              username: 'dicoding',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCasePayload.id,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        username: 'dicoding',
        date,
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        username: 'dicoding',
        content: 'isi comment',
        date,
      }]));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        content: 'sebuah balasan',
        date,
        username: 'dicoding',
        comment_id: 'comment-123',
      }]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.id);
  });
});

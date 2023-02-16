const NewUserCommentLike = require('../NewUserCommentLike');

describe('NewUserCommentLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewUserCommentLike(payload)).toThrowError('NEW_USER_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 123,
      commentId: [],
    };

    // Action & Assert
    expect(() => new NewUserCommentLike(payload)).toThrowError('NEW_USER_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewUserCommentlike entities correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const newUserCommentLike = new NewUserCommentLike(payload);

    // Assert
    expect(newUserCommentLike).toBeInstanceOf(NewUserCommentLike);
    expect(newUserCommentLike.userId).toEqual('user-123');
    expect(newUserCommentLike.commentId).toEqual('comment-123');
  });
});

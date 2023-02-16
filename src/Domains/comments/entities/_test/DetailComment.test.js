const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 123,
      date: [],
      content: {},
      like_count: {},
      is_delete: '123',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    // Arrange
    const date = new Date().toISOString();
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date,
      content: 'sebuah komentar',
      like_count: 0,
      is_delete: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual('comment-123');
    expect(detailComment.username).toEqual('dicoding');
    expect(detailComment.date).toEqual(date);
    expect(detailComment.content).toEqual('sebuah komentar');
    expect(detailComment.likeCount).toEqual(0);
  });

  it('should create a deleted DetailComment entities correctly', () => {
    // Arrange
    const date = new Date().toISOString();
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date,
      content: 'sebuah komentar',
      like_count: 0,
      is_delete: true,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual('comment-123');
    expect(detailComment.username).toEqual('dicoding');
    expect(detailComment.date).toEqual(date);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.likeCount).toEqual(0);
  });
});

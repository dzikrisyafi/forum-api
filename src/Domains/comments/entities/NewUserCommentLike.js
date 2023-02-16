class NewUserCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, commentId } = payload;

    this.userId = userId;
    this.commentId = commentId;
  }

  _verifyPayload(payload) {
    const { userId, commentId } = payload;

    if (!userId || !commentId) {
      throw new Error('NEW_USER_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_USER_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewUserCommentLike;

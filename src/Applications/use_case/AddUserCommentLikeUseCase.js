const NewUserCommentLike = require('../../Domains/comments/entities/NewUserCommentLike');

class AddUserCommentLike {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newUserCommentLike = new NewUserCommentLike(useCasePayload);
    await this._threadRepository.verifyThread(useCasePayload.threadId);
    await this._commentRepository.verifyComment(useCasePayload.commentId);
    const like = await this._commentRepository
      .verifyUserCommentLike(useCasePayload.userId, useCasePayload.commentId);

    if (!like) {
      await this._commentRepository.addUserCommentLike(newUserCommentLike);
    } else {
      await this._commentRepository
        .deleteUserCommentLike(useCasePayload.userId, useCasePayload.commentId);
    }
  }
}

module.exports = AddUserCommentLike;

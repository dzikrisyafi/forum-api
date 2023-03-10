/* eslint-disable camelcase */
class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, like_count, is_delete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.likeCount = like_count;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, like_count, is_delete,
    } = payload;

    if (!id
      || !username
      || !date
      || !content
      || like_count === undefined
      || is_delete === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof like_count !== 'number' || typeof is_delete !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;

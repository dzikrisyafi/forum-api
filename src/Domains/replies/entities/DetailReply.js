/* eslint-disable camelcase */
class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, comment_id, is_delete,
    } = payload;

    this.id = id;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.comment_id = comment_id;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username, comment_id, is_delete,
    } = payload;

    if (!id || !content || !date || !username || !comment_id || is_delete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof comment_id !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;

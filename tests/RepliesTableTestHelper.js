/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', content = 'sebuah balasan', commentId = 'comment-123', owner = 'user-123', date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, commentId, owner, date],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;

const db = require("../db/connection");

exports.selectCommentFromArticleID = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.postCommentOnArticle = (article_id, username, body) => {
  if (username === undefined) {
    return Promise.reject({ status: 400, msg: "username is required" });
  }

  if (body === undefined) {
    return Promise.reject({ status: 400, msg: "body is required" });
  }

  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, article_id]
    )
    .then((data) => {
      return data.rows[0];
    });
};

exports.removeComment = (comment_id) => {
  if (!Number.isInteger(parseInt(comment_id))) {
    return Promise.reject({ status: 400, msg: "comment_id must be a number" });
  }

  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};

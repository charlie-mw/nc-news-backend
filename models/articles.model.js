const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  if (!Number.isInteger(parseInt(article_id))) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return data.rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validOrderByQueries = ["ASC", "DESC"];

  if (!validOrderByQueries.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }

  const validSortByQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by" });
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, count(*) as comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic !== undefined) {
    if (topic.length === 0) {
      return Promise.reject({status: 400, msg: "topic cannot be an empty string"})
    }

    sqlQuery += ` WHERE topic = '${topic}'`;
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;

  return db
    .query(sqlQuery)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => Promise.reject(err));
};

exports.changeArticleVotes = (article_id, votes) => {
  if (votes < 0) {
    return Promise.reject({
      status: 400,
      msg: "An article can not have less than zero votes",
    });
  }

  return db
    .query(
      `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

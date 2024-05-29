const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  if (!Number.isInteger(parseInt(article_id))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
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

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
  const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, count(*) as comment_count FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;
  
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

  return db
    .query(sqlQuery)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => Promise.reject(err));
};

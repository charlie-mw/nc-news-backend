const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
  getArticles,
  getCommentFromArticleID,
} = require("./controllers/api.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentFromArticleID)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    res.status(500).send(err);
  }
});

module.exports = app;

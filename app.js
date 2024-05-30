const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
  getArticles,
  getCommentFromArticleID,
  postNewComment,
  addArticleVotes,
} = require("./controllers/api.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentFromArticleID);
app.post("/api/articles/:article_id/comments", postNewComment);
app.patch("/api/articles/:article_id", addArticleVotes);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send(err);
  }
});

module.exports = app;

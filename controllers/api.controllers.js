const {
  selectArticleById,
  selectArticles,
  selectCommentFromArticleID
} = require("../models/articles.models");
const { selectTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  selectArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentFromArticleID = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentFromArticleID(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch((err) => {
        next(err)
    });
};

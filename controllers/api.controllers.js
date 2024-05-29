const { selectArticleById } = require("../models/articles.models");
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

exports.getArticlesById = (req, res) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
};

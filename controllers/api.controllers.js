const {
  selectArticleById,
  selectArticles,
  changeArticleVotes,
} = require("../models/articles.model");
const {
  removeComment,
  postCommentOnArticle,
  selectCommentFromArticleID,
} = require("../models/comments.model");
const { selectTopics } = require("../models/topics.model");
const { selectUsers } = require("../models/users.model");

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

  selectArticleById(article_id)
    .then((article) => {
      return selectCommentFromArticleID(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  selectArticleById(article_id)
    .then((article) => {
      return postCommentOnArticle(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return next({ status: 400, msg: "inc_votes is required" });
  }

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "inc_votes must be a number" });
  }

  selectArticleById(article_id)
    .then((article) => {
      const newVotes = article.votes + inc_votes;
      return changeArticleVotes(article_id, newVotes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

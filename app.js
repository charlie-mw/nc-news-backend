const express = require("express");
const app = express();
const { getTopics } = require("./controllers/api.controllers");

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
})

module.exports = app 
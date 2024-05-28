const express = require("express");
const app = express();
const { getTopics } = require("./controllers/api.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");


app.get("/api", getEndpoints);
app.get("/api/topics", getTopics)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});


module.exports = app 
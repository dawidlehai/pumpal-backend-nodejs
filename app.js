const express = require("express");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/userRoutes");

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send("It's working!");
});

app.use(express.json());

const apiBase = "/api";
app.use(`${apiBase}/users`, userRouter);

module.exports = app;

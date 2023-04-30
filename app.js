const express = require("express");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(morgan("dev"));

app.use(express.json());

const apiBase = "/api";
app.use(`${apiBase}/users`, userRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Cannot find '${req.originalUrl}' on this server.`,
      404,
      "error"
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;

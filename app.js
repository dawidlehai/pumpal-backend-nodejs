const express = require("express");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/userRoutes");
const workoutRouter = require("./routes/workoutRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(morgan("dev"));

app.use(express.json());

const apiUrlBase = "/api";
app.use(`${apiUrlBase}/users`, userRouter);
app.use(`${apiUrlBase}/workouts`, workoutRouter);

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

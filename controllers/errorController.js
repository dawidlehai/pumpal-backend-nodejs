const AppError = require("./../utils/appError");

module.exports = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= "error";

  if (process.env.NODE_ENV === "development") sendErrDev(err, req, res);
  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) err = handleDuplicateFieldValue(err);
    sendErrProd(err, req, res);
  }
};

function sendErrDev(err, req, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    data: {
      stack: err.stack,
    },
  });
}

function sendErrProd(err, req, res) {
  if (err.isOperational === true)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.status === "error" ? err.message : undefined,
      data: err.data,
    });
  else {
    console.log("Nonoperational internal server error:", err);

    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
}

function handleDuplicateFieldValue(err) {
  const [[key, value]] = Object.entries(err.keyValue);
  let message = `The value '${value}' for the '${key}' field already exists. It should be unique. Please provide another value.`;

  if (key === "username")
    message = `The username '${value}' is already taken. Please choose a different username that is not already in use by another user.`;

  return new AppError(message, 400, "fail", { [key]: message });
}

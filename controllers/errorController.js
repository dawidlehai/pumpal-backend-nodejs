const AppError = require("./../utils/appError");

module.exports = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= "error";

  const env = process.env.NODE_ENV;

  if (env === "development") sendErrDev(err, req, res);
  if (env === "production") {
    if (err.code === 11000) err = handleDuplicateFieldValue(err);
    if (err._message === "User validation failed")
      err = handleValidationFail(err);

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
    console.error("Nonoperational internal server error:", err);

    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
}

function handleDuplicateFieldValue(err) {
  const [[field, value]] = Object.entries(err.keyValue);
  let message = `The value '${value}' for the '${field}' field already exists. It should be unique. Please provide another value.`;

  if (field === "username")
    message = `The username '${value}' is already taken. Please choose a different username.`;

  return new AppError("Duplicate field value error.", 400, "fail", {
    [field]: message,
  });
}

function handleValidationFail(err) {
  const data = {};

  Object.entries(err.errors).forEach(
    ([field, { message }]) => (data[field] = message)
  );

  return new AppError("Validation error.", 400, "fail", data);
}

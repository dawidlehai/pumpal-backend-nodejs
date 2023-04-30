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
      message: err.message,
    });
  else {
    console.log("Nonoperational internal server error:", err);

    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= "error";

  if (process.env.NODE_ENV === "development") sendErrDev(err, req, res);
  if (process.env.NODE_ENV === "production") sendErrProd(err, req, res);
};

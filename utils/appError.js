class AppError extends Error {
  constructor(message, statusCode, status = "fail", data) {
    super(message);

    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

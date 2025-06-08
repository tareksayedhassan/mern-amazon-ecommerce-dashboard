class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

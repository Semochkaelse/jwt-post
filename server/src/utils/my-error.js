module.exports = class MyError extends Error {
  status;

  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static UnauthorizedError(message) {
    return new MyError(401, message)
  }

  static BadRequest(message) {
    return new MyError(400, message);
  }

  static NotFoundError(message) {
    return new MyError(404, message);
  }
}
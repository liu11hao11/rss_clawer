class ApplicationError extends Error {
  constructor(msg, status) {
    super(msg);
    this.name = "Application Error";
    this.status = status || 400;
  }
}
class ParamsError extends ApplicationError {
  constructor(msg, status) {
    super(msg, status);
    this.name = "参数错误";
  }
}

module.exports = {
  ParamsError,
  ApplicationError
};

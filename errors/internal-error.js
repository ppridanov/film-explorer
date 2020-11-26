const { serverErrMsg } = require('../middlewars/errors-success-msg');

class InternalError extends Error {
  constructor() {
    super(serverErrMsg);
    this.statusCode = 500;
  }
}

module.exports = InternalError;

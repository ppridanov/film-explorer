const { serverErrMsg, pageErrMsg } = require('../scripts/errors-success-msg');
const NotFoundError = require('../errors/not-found-error');

module.exports.errHandler = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(message);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverErrMsg
        : message
        
    });
});

module.exports.notFoundErrHandler = ((req, res, next) => {
  next(new NotFoundError(pageErrMsg));
});

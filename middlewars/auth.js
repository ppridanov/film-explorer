const jwt = require('jsonwebtoken');

const AccessError = require('../errors/access-error');
const { devSecret } = require('../scripts/config');
const { accessErrMsg } = require('../scripts/errors-success-msg');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    throw new AccessError(accessErrMsg);
  }
  let payload;

  try {
    payload = jwt.verify(cookie, NODE_ENV === 'production' ? JWT_SECRET : devSecret);
    req.user = payload;
  } catch (err) {
    throw new AccessError(accessErrMsg);
  }
  next();
};

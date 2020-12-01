const jwt = require('jsonwebtoken');

const AccessError = require('../errors/access-error');
const User = require('../models/user');
const { devSecret } = require('../scripts/config');
const { accessErrMsg } = require('../scripts/errors-success-msg');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    const cookie = req.cookies.jwt;
    if (!cookie) {
        return false;
    }
    let payload;
    try {
        payload = jwt.verify(cookie, NODE_ENV === 'production' ? JWT_SECRET : devSecret);
        req.user = payload;
        let result = '';
        await User.findById(req.user._id)
            .then((user) => {
                return result = user;
            })
            .catch((err) => console.log(err));
        return result;
    } catch (err) {
        if (err.message === 'invalid token') {
            return false;
        };
    }
};
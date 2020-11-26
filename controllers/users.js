// Переменные
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');
const {
  userCreatedMsg,
  userJoinMsg,
  notValidMsg,
  emailNotUniqueMsg,
  passNotValidMsg,
} = require('../scripts/errors-success-msg');
const { devSecret } = require('../scripts/config');

const { NODE_ENV, JWT_SECRET } = process.env;


// Создание пользователя
module.exports.createUser = (req, res, next) => {
  try {
    if (req.body.password.length < 8) {
      throw new BadRequest(passNotValidMsg);
    }
  } catch (err) {
    return next(err);
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        about: req.body.about,
        avatar: req.body.avatar,
      }, (err, user) => {
        try {
          if (err != undefined || user == undefined) {
            if (err.code === 11000) {
              next(new BadRequest(emailNotUniqueMsg));
              return;
            }
            next(new BadRequest(notValidMsg));
            return;
          }
          res.send({ message: userCreatedMsg });
        } catch (err) {
          next(err);
        }
      });
    });
};

// Вход пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  let userId = '';
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AccessError(notValidMsg);
      }
      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new AccessError(notValidMsg);
      }
      const token = jwt.sign({ _id: userId }, NODE_ENV === 'production' ? JWT_SECRET : devSecret, { expiresIn: '7d' });
      res
        .status(200)
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({
          message: userJoinMsg,
          jwt: token,
        })
        .end();
        render('/index');
    })
    .catch(next);
};

// Получить своего пользователя
module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

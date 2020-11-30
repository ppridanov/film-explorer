// Переменные
const router = require('express').Router();
const { getUser, createUser, login } = require('../controllers/users');
const auth = require('../middlewars/auth');
const { newUserValidator, loginValidator } = require('../middlewars/validator');

// Роуты пользователей
router.get('/users/me', getUser);


// Роуты регистрациии и входа
router.post('/signup', newUserValidator, createUser);
router.post('/signin', loginValidator, login);

module.exports = router;

// Переменные
const router = require('express').Router();
const passport = require('passport');
const { getUser, createUser, login, logout, getAccountPage, addFilmToUser, deleteFilmFromUser,  } = require('../controllers/users');
const auth = require('../middlewars/auth');
const { newUserValidator, loginValidator } = require('../middlewars/validator');


// Роуты пользователей
router.get('/users/me', getAccountPage);
router.post('/users/movie/add', addFilmToUser);
router.delete('/users/movie/delete', deleteFilmFromUser);

// Роуты регистрациии, входа и выхода
router.post('/signup', newUserValidator, createUser);
router.post('/signin', loginValidator, login);
router.get('/logout', logout);

module.exports = router;

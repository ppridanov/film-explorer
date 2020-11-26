// Переменные
const router = require('express').Router();
const { getAllFilms, getFilm, createFilm, deleteFilm } = require('../controllers/films');
const auth = require('../middlewars/auth');
const { filmCreateValidator } = require('../middlewars/validator');

// Роуты фильмов
router.get('/films', auth, getAllFilms);
router.get('/films/:filmId', getFilm)
router.post('/films', auth, filmCreateValidator, createFilm);
router.delete('/films/:filmId', auth, deleteFilm);

module.exports = router;

// Переменные
const router = require('express').Router();
const { getCategory } = require('../controllers/category');
const { getAllFilms, createFilm, deleteFilm } = require('../controllers/films');
const auth = require('../middlewars/auth');
const { filmCreateValidator } = require('../middlewars/validator');
const { popularUrl } = require('../scripts/config');

// Роуты фильмов
router.get('/films', auth, getAllFilms);
router.use((req, res, next) => {
    req.data = {
        link: 'popular',
        name: 'Popular category',
        url: popularUrl,
    }
    next();
})
router.get('/films/popular/:page', getCategory);
router.use((req, res, next) => {
    req.data = {
        link: 'popular',
        name: 'Genre',
    }
    next();
})
router.get('/films/genre/:genreName/:page', getCategory);
router.post('/films', auth, filmCreateValidator, createFilm);
router.delete('/films/:filmId', auth, deleteFilm);

module.exports = router;

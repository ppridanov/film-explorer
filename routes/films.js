// Переменные
const router = require('express').Router();
const { getCategory } = require('../controllers/category');
const { getAllFilms, createFilm, deleteFilm, getFilm, rateMovie} = require('../controllers/films');
const { filmCreateValidator } = require('../middlewars/validator');
const { popularUrl } = require('../scripts/config');


// Роуты фильмов
router.get('/film/:id', getFilm);
router.use((req, res, next) => {
    req.data = {
        link: 'popular',
        name: 'Popular',
        url: popularUrl,
    }
    next();
})
router.get('/films/popular/:page', getCategory);
router.use((req, res, next) => {
    req.data = {
        link: 'genre',
        name: 'Genre',
    }
    next();
})
router.get('/films/genre/:genreName/:page', getCategory);
router.post('/films', filmCreateValidator, createFilm);
router.post('/film/giverating', rateMovie);
router.delete('/films/:filmId', deleteFilm);

module.exports = router;

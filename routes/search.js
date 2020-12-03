const router = require('express').Router();
const { getCategory } = require('../controllers/category');
const { searchMovie } = require('../controllers/search');
const { getMovieByTags } = require('../controllers/tags');

router.use((req, res, next) => {
    req.data = {
        name: 'Search',
    }
    next();
})
router.post('/search/:page', getCategory);
router.get('/search/:page', getCategory);
router.use((req, res, next) => {
    req.data = {
        name: 'Tag'
    }
    next();
})
router.get('/search/tags/:id', getCategory);
module.exports = router;

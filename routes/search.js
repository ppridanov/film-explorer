const router = require('express').Router();
const { getMovieByTags } = require('../controllers/tags');

router.get('/search/tags/:id', getMovieByTags);
module.exports = router;

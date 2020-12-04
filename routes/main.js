const router = require('express').Router();
router.use('/', require('../routes/users'));
router.use('/', require('../routes/films'));
router.use('/', require('../routes/index'));
router.use('/', require('../routes/comments'));
router.use('/', require('../routes/tags'));
router.use('/', require('../routes/search'));

module.exports = router;

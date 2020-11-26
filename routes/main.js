const router = require('express').Router();

router.use('/', require('../routes/films'));
router.use('/', require('../routes/users'));
router.use('/', require('../routes/index'));

module.exports = router;

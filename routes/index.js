const router = require('express').Router();
const { renderHomePage } = require('../controllers/index');
router.get('/', renderHomePage)

module.exports = router;

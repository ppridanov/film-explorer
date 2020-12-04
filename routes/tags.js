const router = require('express').Router();
const { addTags, renderTags } = require('../controllers/tags');

router.post('/tags/add', addTags);
router.get('/tags/render/:id', renderTags);
module.exports = router;

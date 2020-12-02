const router = require('express').Router();
const { postComment, getComments } = require('../controllers/comments');

router.post('/comments', postComment);
router.get('/comments', getComments);
module.exports = router;

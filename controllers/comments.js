const Comment = require("../models/comment");
const BadRequest = require('../errors/bad-request-error');
const { notValidMsg } = require("../scripts/errors-success-msg");
const comment = require("../models/comment");


module.exports.postComment = (req, res, next) => {
    const { filmId, author, text, added, tags } = req.body;
  Comment.create(
    {
      filmId,
      author,
      text,
      added,
      tags,
    },
    (err, comment) => {
      try {
        if (err != undefined || comment == undefined) {
          next(err);
          return;
        }
        res
          .status(200)
          .send({
            message: 'Success comment'
          })
          .end();
      } catch (err) {
        next(err);
      }
    }
  );
};

module.exports.getComments = async (id) => {
    const comments = await Comment.find({filmId: id}, (err, data) => {
        if (err) {
            console.log(err);
        };
        return data;
    })
    return comments;
}
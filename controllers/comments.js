const Comment = require("../models/comment");
const BadRequest = require("../errors/bad-request-error");
const { notValidMsg } = require("../scripts/errors-success-msg");
const comment = require("../models/comment");
const auth = require("../middlewars/auth");

module.exports.postComment = async (req, res, next) => {
  const userData = await auth(req, res, next);
  if (userData) {
    const author = {
      name: userData.name,
      id: userData.id,
      url: `/users/${userData.id}`
    }
    const { filmId, text } = req.body;
    Comment.create(
      {
        filmId,
        author,
        text,
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
              message: "Success comment",
            })
            .end();
        } catch (err) {
          next(err);
        }
      }
    );
  } else {
    res.status(401);
    res.send('Unauthorized!')
    res.end();
  }
};

module.exports.getComments = async (id) => {
  const comments = await Comment.find({ filmId: id }, (err, data) => {
    if (err) {
      console.log(err);
    }
    return data;
  });
  return comments;
};


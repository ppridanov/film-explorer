const NotFoundError = require("../errors/not-found-error");
const AccessError = require("../errors/access-error");
const {
  notFoundIdMsg,
  accessErrMsg,
} = require("../scripts/errors-success-msg");

// Получаем все фильмы пользователя
module.exports.renderHomePage = (req, res, next) => {
  const title = "MovieGenerator - HomePage";
  res.render("main", { title: title, isAuth: false });
};

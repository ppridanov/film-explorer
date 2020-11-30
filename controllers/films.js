// Переменные
const Film = require("../models/film");
const NotFoundError = require("../errors/not-found-error");
const AccessError = require("../errors/access-error");
const {
  notFoundIdMsg,
  accessErrMsg,
} = require("../scripts/errors-success-msg");

// Получаем все фильмы пользователя
module.exports.getAllFilms = (req, res, next) => {
  const ownerId = req.user._id;
  Film.find({ owner: ownerId })
    .then((film) => {
      res.send(film);
    })
    .catch(next);
};

// Создаем фильм
module.exports.createFilm = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const ownerId = req.user._id;
  Film.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: ownerId,
  })
    .then((film) => {
      res.send(film);
    })
    .catch(next);
};

// Удаляем фильм из коллекции
module.exports.deleteFilm = (req, res, next) => {
  const { filmId } = req.params;
  const ownerId = req.user._id;
  Film.findById(filmId)
    .select("+owner")
    .then((film) => {
      if (!film) {
        throw new NotFoundError(notFoundIdMsg);
      }
      if (film.owner.toString() !== ownerId) {
        throw new AccessError(accessErrMsg);
      }
      Film.findByIdAndRemove(filmId)
        .then((film) => {
          if (!film) {
            throw new NotFoundError(notFoundIdMsg);
          }
          res.send(film);
        })
        .catch(next);
    })
    .catch(next);
};

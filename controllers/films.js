// Переменные
const Film = require("../models/film");
const NotFoundError = require("../errors/not-found-error");
const AccessError = require("../errors/access-error");
const {
  notFoundIdMsg,
  accessErrMsg,
} = require("../scripts/errors-success-msg");
const { apiKey, partTitle } = require("../scripts/config");
const { getData } = require("../middlewars/api");
const { nav } = require("./nav");
const auth = require("../middlewars/auth");
const { getComments } = require("./comments");


// Получаем все фильмы пользователя
module.exports.getAllFilms = (req, res, next) => {
  const ownerId = req.user._id;
  Film.find({ owner: ownerId })
    .then((film) => {
      res.send(film);
    })
    .catch(next);
};

module.exports.getFilm = async (req, res, next) => {
  const movieId = req.url.split("/").pop();
  const url = await `https://api.themoviedb.org/3/movie/${Number(movieId)}?api_key=${apiKey}&language=en-US`;
  const header = await nav();
  const user = await auth(req, res, next);
  const apiResponse = await getData(url);
  const comments = await getComments(movieId);
  const resData = {
    isAuth: (!user) ? false : true,
    userId: user._id,
    userName: user.name,
    title: partTitle + apiResponse.title + ' movie',
    filmName: apiResponse.title,
    nav: header.genres,
    results: apiResponse,
    comments: comments
  };
  res.render('main', {data: resData});
}

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

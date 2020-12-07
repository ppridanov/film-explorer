// Переменные
const Film = require("../models/film");
const Rating = require("../models/rating");
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
const { renderTags } = require("./tags");

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

module.exports.getMovieById = async (array) => {
  const moviesArray = await getMovie(array);
  const data = {
    link: req.data.link,
    results: moviesArray,
    pages: 0,
    name: tagName,
    title: title,
    page: typeof page !== "undefined" ? page : 1,
  };
  return data;
};

module.exports.rateMovie = async (req, res, next) => {
  const user = await auth(req, res, next);
  if (user) {
    Rating.findOne(
      {
        filmId: req.body.filmId,
      },
      (err, rating) => {
        if (rating != null) {
          if (rating.userId.indexOf(user._id) == -1) {
            rating.userId.push(user._id);
            rating.count = ++rating.count;
            rating.value = rating.value + req.body.value;
            rating.average = rating.value / rating.count;
            rating.average = rating.average.toFixed(1);
            rating.save();
            res.send({ message: "success votin" });
          } else {
            console.log("user are voted");
            res.send({ message: "user are voted" });
          }
        } else {
          Rating.create(
            {
              filmId: req.body.filmId,
              userId: user._id,
              value: req.body.value,
            },
            (err, rating) => {
              if (err) {
                console.log(err);
                next();
              }
              rating.average = rating.value / rating.count;
              rating.average = rating.average.toFixed(1);
              rating.save();
              res.send({rating: rating})
            }
          );
        }
      }
    );
    // Rating.create({
    //   filmId: req.body.filmId,
    //   userId: user._id,
    //   value: req.body.value
    // }, (err, rating) => {
    //   if (err) {
    //     console.log(err);
    //     next();
    //   }
    //   console.log(rating)
    // })
  } else {
    console.log("Not authorized");
  }
};

module.exports.getMovieRating = async (filmId) => {
  const result = await Rating.findOne(
    {
      filmId: filmId,
    },
    async (err, rating) => {
      if (rating != null) {
        return rating.average;
      } else {
        return 0;
      }
    }
  );
  return result;
};

module.exports.getFilm = async (req, res, next) => {
  const movieId = req.url.split("/").pop();
  const url = await `https://api.themoviedb.org/3/movie/${Number(
    movieId
  )}?api_key=${apiKey}&language=en-US`;
  const header = await nav();
  const user = await auth(req, res, next);
  const apiResponse = await getData(url);
  const resComments = await getComments(movieId);
  const resTags = await renderTags(req, res, next);
  const resRating = await this.getMovieRating(movieId);
  const resData = {
    isAuth: !user ? false : true,
    tags: resTags ? resTags.tags : undefined,
    userId: user._id,
    userName: user.name,
    userFilms: user.films,
    title: partTitle + apiResponse.title + " movie",
    filmName: apiResponse.title,
    nav: header.genres,
    results: apiResponse,
    comments: resComments,
    rating: resRating,
  };
  res.render("main", { data: resData });
};

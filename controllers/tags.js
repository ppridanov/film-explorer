const { getData } = require("../middlewars/api");
const auth = require("../middlewars/auth");
const Comment = require("../models/comment");
const { apiKey, partTitle } = require("../scripts/config");;
const { nav } = require("./nav");


module.exports.getTags = async (req, res, next) => {
  const tagName = await req.url.split("/").pop().replace('%20', ' ');
  return await Comment.find(
    {
      tags: { $in: tagName },
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length != 0) {
          return data;
        } else {
          res.send("Not found");
        }
      }
    }
  );
};

module.exports.getMovie = async (filmIds) => {
  const results = [];
  for (let filmId of filmIds) {
    const movie = await getData(
      `https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=en-US`
    );
    await results.push(movie);
  }
  return results;
};

module.exports.getMovieByTags = async (req, res, next) => {
  const filmsArray = [];
  const tagName = await req.url.split("/").pop().replace("%20", " ");
  const title = partTitle + "TagName: " + tagName;
  const commentArray = await this.getTags(req, res, next);
  const user = await auth(req, res, next);
  const header = await nav();
  await commentArray.forEach((el) => {
    filmsArray.push(el.filmId);
  });
  const moviesArray = await this.getMovie(filmsArray);
  const resData = {
    isAuth: !user ? false : true,
    userId: user._id,
    userName: user.name,
    title: title,
    nav: header.genres,
    results: moviesArray,
  };
  return await res.render("main", { data: resData });
};

const url = require("url");
const { getData } = require("../middlewars/api");
const auth = require("../middlewars/auth");
const { partTitle, discoverUrl } = require("../scripts/config");
const { getMovieById } = require("./films");
const { renderGenres } = require("./genre");
const { nav } = require("./nav");
const { searchMovie } = require("./search");
const { renderMoviesByTags } = require("./tags");

module.exports.getCategory = async (req, res, next) => {
  const user = await auth(req, res, next);
  const header = await nav();
  const page = req.url.split("/").pop();
  let data = '';
  let apiLink = req.data.url ? req.data.url : discoverUrl;
  let apiRes = await getData(apiLink + page).then((res) => {
    return res;
  });
  let title = String(partTitle + req.data.name + ' category');
  let name = req.data.name;
  if (req.data.name == "Popular") {
    data = {
      page: page,
      link: req.data.link,
      results: apiRes.results,
      pages: apiRes.total_pages,
      name: name + ' category',
      title: title,
      page: typeof page !== "undefined" ? page : 1,
    }
  }
  if (req.data.name == "Genre") {
    data = await renderGenres(req, res, next);
  }
  if (req.data.name == "Search") {
    data = await searchMovie(req, res, next);
  }
  if (req.data.name == "Tag") {
    data = await renderMoviesByTags(req, res, next);
  }

  data.isAuth = (!user) ? false : true;
  data.userId = user._id;
  data.userName = user.name;
  data.nav = header.genres;
  return await res.render("main", { data: data });
};

const NotFoundError = require("../errors/not-found-error");
const AccessError = require("../errors/access-error");
const { getData } = require('../middlewars/api');
const { popularUrl } = require('../scripts/config');
const {
  notFoundIdMsg,
  accessErrMsg,
} = require("../scripts/errors-success-msg");
const { nav } = require("./nav");

// Получаем популярные фильмы с api
module.exports.renderHomePage = async (req, res, next) => {
  const apiResponse = await getData(popularUrl).then((res) => {
    return res;
  });
  const header = await nav();
  const title = "MovieGenerator - HomePage";
  const data = {
    isAuth: false,
    title: title,
    nav: header.genres,
    results: apiResponse.results,
    pages: apiResponse.total_pages,
    page: (typeof page !== 'undefined') ? page : 1,
  };
  return await res.render("main", { data: data });
};
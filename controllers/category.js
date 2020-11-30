const url = require("url");
const { getData } = require("../middlewars/api");
const { nav } = require("./nav");

module.exports.getCategory = async (req, res) => {
  const page = req.url.split("/").pop();
  let title = String("Movie Generation - " + req.data.name);
  if (req.data.name == 'Genre') {
    let genresName = req.url.split('/');
    genresName.splice(0, 3);
    genresName = genresName.join();
    console.log(genresName);
    title = 'GENRESSSSS';
  }
  const apiResponse = await getData(req.data.url + page).then((res) => {
    return res;
  });
  const header = await nav();

  console.log(req.data);
  const resData = {
    link: req.data.link,
    isAuth: false,
    title: title,
    nav: header.genres,
    results: apiResponse.results,
    pages: apiResponse.total_pages,
    page: typeof page !== "undefined" ? page : 1,
  };
  console.log(title.includes('category'));
  return await res.render("main", { data: resData });
};

const url = require("url");
const { getData } = require("../middlewars/api");
const auth = require("../middlewars/auth");
const { partTitle, discoverUrl } = require("../scripts/config");
const { nav } = require("./nav");

module.exports.getCategory = async (req, res, next) => {
  const user = await auth(req, res, next);
  const header = await nav();
  const page = req.url.split("/").pop();
  let apiLink = req.data.url ? req.data.url : discoverUrl;
  let apiResponse = await getData(apiLink + page).then((res) => {
    return res;
  });
  let title = String(partTitle + req.data.name);
  let name = req.data.name;
  if (req.data.name == "Genre") {
    let genresName = req.url.split("/");

    genresName.splice(0, 3);
    genresName.splice(1, 1);
    genresName = genresName.join();
    if (genresName.includes("%20")) {
      genresName = genresName.split("%20").splice(0, 1).join("");
    }
    title =
      partTitle +
      genresName[0].toUpperCase() +
      genresName.slice(1) +
      " category";
    name = genresName[0].toUpperCase() + genresName.slice(1) + " category";

    const newLocal = await header.genres.find((item) =>
      item.name.toLowerCase().includes(genresName)
    );
    apiResponse = await getData(apiLink + newLocal.id + "&page=" + page).then(
      (res) => {
        return res;
      }
    );
  }

  const resData = {
    link: req.data.link,
    isAuth: (!user) ? false : true,
    userId: user._id,
    userName: user.name,
    title: title,
    name: name,
    nav: header.genres,
    results: apiResponse.results,
    pages: apiResponse.total_pages,
    page: typeof page !== "undefined" ? page : 1,
  };
  return await res.render("main", { data: resData });
};

const { getData } = require("../middlewars/api");
const { partTitle, discoverUrl } = require("../scripts/config");
const { nav } = require("./nav");



module.exports.renderGenres = async (req, res, next) => {
    let genresName = req.url.split("/");
    genresName.splice(0, 3);
    genresName.splice(1, 1);
    genresName = genresName.join();
    if (genresName.includes("%20")) {
        genresName = genresName.split("%20").splice(0, 1).join("");
    }
    const page = req.url.split("/").pop();
    const header = await nav();
    const apiLink = discoverUrl;
    const title =
        partTitle +
        genresName[0].toUpperCase() +
        genresName.slice(1) +
        " category";
    const name = genresName[0].toUpperCase() + genresName.slice(1) + " category";

    const newLocal = await header.genres.find((item) =>
        item.name.toLowerCase().includes(genresName)
    );
    const apiRes = await getData(apiLink + newLocal.id + "&page=" + page).then(
        (res) => {
            return res;
        }
    );
    const data = {
        page: page,
        results: apiRes.results,
        pages: apiRes.total_pages,
        link: req.data.link + '/' + genresName,
        name: name,
        title: title,
        page: typeof page !== "undefined" ? page : 1,
    }
    return data;
}
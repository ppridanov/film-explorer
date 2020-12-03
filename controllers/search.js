const { getData } = require("../middlewars/api")
const { apiKey } = require("../scripts/config")

module.exports.searchMovie = async (req, res, next) => {
    let name = (req.body.search) ? req.body.search : req.cookies.searchName;
    let page = req.url.split('/').pop();
    let data = ''
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${name}&page=${page}&include_adult=false`;
    const apiRes = await getData(searchUrl);
    data = {
        page: page,
        results: apiRes.results,
        pages: apiRes.total_pages,
        name: name + ' category',
        title: `Search "${name}"`,
        page: typeof page !== "undefined" ? page : 1,
    }
    res.cookie('searchName', name);
    return data;
}

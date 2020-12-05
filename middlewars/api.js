const rp = require("request-promise");
const { apiKey } = require("../scripts/config");

module.exports.getData = async (url) => {
  return rp({
    url: url,
    method: "GET",
    json: true,
  }).then((data) => {
    return data;
  });
};

module.exports.getMovie = async (filmIds) => {
  const results = [];
  for (let filmId of filmIds) {
    const movie = await this.getData(
      `https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=en-US`
    );
    await results.push(movie);
  }
  return results;
};
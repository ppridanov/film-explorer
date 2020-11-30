const devMongooseUrl = 'mongodb://localhost:27017/filmsdb';
const devSecret = 'dev-secret';
const apiKey = 'be108878e83f4cfcd89e3a228bde78c9'
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
const { NODE_ENV, MONGOOSE_BASEURL } = process.env;
const mongoUrl = NODE_ENV === 'production' ? MONGOOSE_BASEURL : devMongooseUrl;

module.exports = {
  devSecret,
  mongoUrl,
  popularUrl,
  genresUrl
};

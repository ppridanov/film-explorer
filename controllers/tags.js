const { getMovie } = require("../middlewars/api");
const auth = require("../middlewars/auth");
const Tag = require("../models/tag");
const user = require("../models/user");
const { partTitle } = require("../scripts/config");;


module.exports.addTags = async (req, res, next) => {
  const tags = req.body.tags.filter(String);
  const filmId = req.body.filmId;
  const userData = await auth(req, res, next);
  const author = {
    name: userData.name,
    url: '/users/' + userData.id
  }
  if (userData) {
    const tag = await Tag.findOne({
      filmId: filmId
    });
    if (tag != null && tag.tags.length != 0) {
      tags.forEach(el => {
        if (tag.tags.indexOf(el) === -1) {
          tag.tags.push(el)
        }
        return;
      })
      tag.save();
    } else {
      Tag.create({
        filmId,
        author,
        tags
      }, (err, data) => {
        if (err) console.log(err.message);
        return data;
      })
    }
    res.send({ message: 'Added tags', tags: tags})
  } else {
    res
      .status(500)
      .send({ message: "Not Authorized" })
  }
}

module.exports.renderTags = async (req, res, next) => {
  const filmId = await req.url.split("/").pop().replace('%20', ' ');
  const result = await Tag.findOne({
    filmId
  }, (err, data) => {
    if (err) console.log(err.messages);
    return data;
  })
  return result;
}

module.exports.getTags = async (req, res, next) => {
  const tagName = await req.url.split("/").pop().replace('%20', ' ');
  return await Tag.find(
    {
      tags: { $in: tagName },
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length != 0) {
          return data;
        }
      }
    }
  );
};

module.exports.renderMoviesByTags = async (req, res, next) => {
  const filmsArray = [];
  const tagName = await req.url.split("/").pop().replace("%20", " ");
  const title = partTitle + "TagName: " + tagName;
  const commentArray = await this.getTags(req, res, next);
  await commentArray.forEach((el) => {
    filmsArray.push(el.filmId);
  });
  const moviesArray = await getMovie(filmsArray);
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

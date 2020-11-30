const rp = require("request-promise");

module.exports.getData = async (url) => {
  return rp({
    url: url,
    method: "GET",
    json: true,
  }).then((data) => {
    return data;
  });
};

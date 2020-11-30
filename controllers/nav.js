const { genresUrl } = require('../scripts/config');
const { getData } = require("../middlewars/api");

module.exports.nav = async (req, res, next) => {
    const header = await getData(genresUrl).then((data) => {
        return data;
    });
    return header;
}


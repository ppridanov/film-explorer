const mongoose = require('mongoose');
const { checkLinkMsg, checkImageMsg } = require('../scripts/validator-msg');

const filmSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\//.test(v);
      },
      message: checkLinkMsg,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\//.test(v);
      },
      message: checkImageMsg,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('film', filmSchema);

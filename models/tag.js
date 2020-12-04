const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    filmId: {
      type: Number,
      required: true,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    added: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String]
    }
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("tag", tagSchema);

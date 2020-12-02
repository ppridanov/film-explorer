const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
    text: {
      type: String,
      required: true,
    },
    added: {
        type: Date,
        default: Date.now
    },
    tags: {
      type: [String],
    },
    answers: [
        comments = []
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("comment", commentSchema);

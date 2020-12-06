const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    filmId: {
      type: Number,
      required: true,
    },
     userId: [String],
    value: {
      type: Number,
      required: true,
    },
    count: {
        type: Number,
        default: 1
    },
    average: {
        type: Number
    }
  },
  {
    versionKey: false,
  }
);


module.exports = mongoose.model("rating", ratingSchema);

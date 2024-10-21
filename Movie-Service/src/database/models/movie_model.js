const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    genre: {
      type: [String],
      required: true,
    },

    // url
    poster: String,

    director: {
      type: String,
      required: true,
      trim: true,
    },

    cast: [
      {
        actor: {
          type: String,
          required: true,
        },
        character: {
          type: String,
          required: true,
        },
      },
    ],

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    // total minute
    duration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("movie_details", MovieSchema);

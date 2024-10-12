const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    profileImageUrl: String,

    subscriptionPlan: {
      planName: String,
      startDate: Date,
      expiryDate: Date,
      autoRenew: Boolean,
    },

    watchHistory: [
      {
        movieId: String,
        watchedAt: Date,
        progress: Number,
      },
    ],
    //stores movie ids
    favorites: [String],
    roles: [String],

    settings: {
      language: String,
      preferredGenres: String,
      notifications: {
        email: Boolean,
        sms: Boolean,
        push: Boolean,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customers", CustomerSchema);

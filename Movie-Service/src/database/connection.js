const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

module.exports = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Database Connection Success.".blue.underline.bold);
    })
    .catch((err) => {
      console.log(err);
    });
};

const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");
const { GridFSBucket, Db } = require("mongodb");

let gfs;
const ConnectToTheDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(MONGO_URI)
      .then((res) => {
        // @ts-ignore
        gfs = new GridFSBucket(res.connection.db, { bucketName: "uploads" });
        resolve("Database Connection Success.");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  gfs,
  ConnectToTheDB,
};

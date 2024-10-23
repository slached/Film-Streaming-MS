module.exports = {
  DatabaseConnection: require("./connection").ConnectToTheDB,
  GFS: require("./connection").gfs,
  MovieRepository: require("./repository/movie_repository"),
};

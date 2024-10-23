module.exports = {
  Auth: require("./auth"),
  MulterMemory: require("./multerMemory"),
  MulterDisk: require("./multerDisk"),
  //Validators
  MovieDetailValidator: require("./movie_validation").movieDetailValidator,
  MultipleMovieDetailValidator: require("./movie_validation").multipleMovieDetailValidator,
  UpdateMovieValidator: require("./movie_validation").updateMovieValidator,
};

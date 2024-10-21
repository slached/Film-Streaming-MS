module.exports = {
  Auth: require("./auth"),
  MulterSingle: require("./multer"),
  //Validators
  MovieDetailValidator: require("./movie_validation").movieDetailValidator,
  MultipleMovieDetailValidator: require("./movie_validation").multipleMovieDetailValidator,
  UpdateMovieValidator: require("./movie_validation").updateMovieValidator,
};

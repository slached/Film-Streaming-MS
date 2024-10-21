const { movieDetailSchema, multiMovieSchema, updateMovieSchema } = require("../../validation/movie_schemas");

// this validates the body according to validation
// if there is an issue in body it's convert body to required shape
const movieDetailValidator = (req, res, next) => {
  const { error, value } = movieDetailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};

const multipleMovieDetailValidator = (req, res, next) => {
  const { error, value } = multiMovieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};

const updateMovieValidator = (req, res, next) => {
  const { error, value } = updateMovieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};

module.exports = {
  movieDetailValidator,
  multipleMovieDetailValidator,
  updateMovieValidator,
};

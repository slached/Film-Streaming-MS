const Joi = require("joi");
const { MovieDetailValidator } = require("../api/middlewares");

// Schemas Goes Here
const movieDetailSchema = Joi.object({
  title: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  releaseDate: Joi.date().required(),

  genre: Joi.array().items(Joi.string()).required(),

  poster: Joi.string().uri(),

  director: Joi.string().trim().required(),

  cast: Joi.array()
    .items(
      Joi.object({
        actor: Joi.string().required(),
        character: Joi.string().required(),
      })
    )
    .required(),

  rating: Joi.number().min(0).max(10).default(0),

  duration: Joi.number().positive().integer(),
});

const multiMovieSchema = Joi.array().items(movieDetailSchema);

const updateMovieSchema = Joi.object({
  title: Joi.string().trim().optional(),

  description: Joi.string().trim().optional(),

  releaseDate: Joi.date().optional(),

  genre: Joi.array().items(Joi.string()).optional(),

  poster: Joi.string().uri(),

  director: Joi.string().trim().optional(),

  cast: Joi.array()
    .items(
      Joi.object({
        actor: Joi.string().optional(),
        character: Joi.string().optional(),
      })
    )
    .optional(),

  rating: Joi.number().min(0).max(10).default(0).optional(),

  duration: Joi.number().positive().integer().optional(),
});

module.exports = {
  movieDetailSchema,
  multiMovieSchema,
  updateMovieSchema,
};

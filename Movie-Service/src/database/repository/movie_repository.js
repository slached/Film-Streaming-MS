const { BadContentError } = require("../../util/errors/app-errors");
const Movie = require("../models/movie_model");
class CustomerRepository {
  constructor() {}

  deleteMovie = async (id) => {
    return await Movie.deleteOne({ _id: id })
      .then((res) => res)
      .catch((err) => {
        throw new BadContentError(err.message);
      });
  };

  movieQuantity = async () => {
    return await Movie.countDocuments();
  };

  findAllMovies = async (moviePerReq, page) => {
    return await Movie.find()
      .skip(page * moviePerReq)
      .limit(moviePerReq);
  };

  findOneMovie = async (id) => {
    return await Movie.findById(id)
      .then((res) => res)
      .catch((err) => {
        throw new BadContentError(err.message);
      });
  };

  createNewMovie = async (movie) => {
    const newMovie = new Movie(movie);
    return await newMovie
      .save()
      .then((res) => res)
      .catch((err) => {
        throw new BadContentError(err.message);
      });
  };

  findMovieAndUpdate = async (id, body) => {
    {
      return await Movie.findByIdAndUpdate(id, body)
        .then((res) => res)
        .catch((err) => {
          throw new BadContentError(err.message);
        });
    }
  };
}

module.exports = CustomerRepository;

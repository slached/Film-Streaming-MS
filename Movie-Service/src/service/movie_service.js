const { MovieRepository } = require("../database");
const { BadContentError } = require("../util/errors/app-errors");

class MovieService {
  constructor() {
    this.MovieRepository = new MovieRepository();
  }

  GetAllMovies = async (moviePerReq = 10, page = 0) => {
    page = parseInt(page.toString());
    moviePerReq = parseInt(moviePerReq.toString());

    const response = {
      hasNext: false,
      movies: [],
      next: parseInt(page.toString()) + 1,
    };

    const moviesQty = await this.MovieRepository.movieQuantity();
    // this adds total movie count into response
    response["totalMovieCount"] = moviesQty;
    // this condition checks for all of the movies showed or not
    response.hasNext = moviePerReq * (page + 1) < moviesQty;
    // if response does not have next page so do not show next
    // @ts-ignore
    if (!response.hasNext) delete response.next;

    // @ts-ignore
    // add movies to response
    response.movies = await this.MovieRepository.findAllMovies(moviePerReq, page);
    return response;
  };

  GetOneMovie = async (id) => {
    return await this.MovieRepository.findOneMovie(id);
  };

  CreateMovie = async (movie) => {
    return await this.MovieRepository.createNewMovie(movie);
  };

  CreateMultipleMovie = async (movies) => {
    let count = 0;
    for (const movie of movies) {
      await this.MovieRepository.createNewMovie(movie);
      count++;
    }
    return { message: `${count} movies created.` };
  };

  DeleteMovieById = async (id) => {
    return await this.MovieRepository.deleteMovie(id);
  };

  UpdateMovie = async (id, body) => {
    await this.MovieRepository.findMovieAndUpdate(id, body);
    return { message: `${id} movie updated successfully.` };
  };

  IsValidMovie = async (movieId) => {
    // if this does not return an exception than there is a movie in db
    try {
      const movie = await this.MovieRepository.findOneMovie(movieId);
      if (!movie) throw new BadContentError("Movie is not valid");
      return true;
    } catch (error) {
      return false;
    }
  };

  SubscribeService = async (payload) => {
    const { data, serviceName } = payload;

    const { id, moviePerReq, page, movieId } = data;

    switch (serviceName) {
      case "GetAllMovies":
        return await this.GetAllMovies(moviePerReq, page);
      case "GetOneMovie":
        return await this.GetOneMovie(id);
      case "IsValidMovie":
        return await this.IsValidMovie(movieId);
      default:
        throw new BadContentError("There is no such service");
    }
  };
}

module.exports = MovieService;

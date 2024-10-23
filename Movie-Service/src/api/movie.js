const MovieService = require("../service/movie_service");
const { STATUS_CODES } = require("../util/errors/app-errors");
const { Auth, MovieDetailValidator, MultipleMovieDetailValidator, UpdateMovieValidator, MulterMemory, MulterDisk } = require("./middlewares");
const { Server } = require("../util");

module.exports = async (app, channel) => {
  const movieService = new MovieService();
  // rabbit server listening
  Server(channel, movieService);

  app.get("/", Auth, async (req, res, next) => {
    try {
      const { perPage, page } = req.query;
      return res.status(STATUS_CODES.OK).json(await movieService.GetAllMovies(perPage, page));
    } catch (error) {
      next(error);
    }
  });

  app.get("/:id", Auth, async (req, res, next) => {
    try {
      const { id } = req.params;
      return res.status(STATUS_CODES.OK).json(await movieService.GetOneMovie(id));
    } catch (error) {
      next(error);
    }
  });

  app.post("/create", Auth, MovieDetailValidator, async (req, res, next) => {
    try {
      // first validate body
      const body = req.body;
      return res.status(STATUS_CODES.OK).json(await movieService.CreateMovie(body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/createMultiple", Auth, MultipleMovieDetailValidator, async (req, res, next) => {
    try {
      // first validate body
      const body = req.body;
      return res.status(STATUS_CODES.OK).json(await movieService.CreateMultipleMovie(body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/upload", Auth, MulterDisk.single("movie"), async (req, res, next) => {
    try {
      console.log(req.file);
      return res.status(STATUS_CODES.OK).json("ok");
    } catch (error) {
      next(error);
    }
  });

  app.delete("/delete/:id", Auth, async (req, res, next) => {
    try {
      // first validate body
      const { id } = req.params;
      return res.status(STATUS_CODES.OK).json(await movieService.DeleteMovieById(id));
    } catch (error) {
      next(error);
    }
  });

  app.put("/update/:id", Auth, UpdateMovieValidator, async (req, res, next) => {
    try {
      // first validate body
      const { id } = req.params;
      const body = req.body;
      return res.status(STATUS_CODES.OK).json(await movieService.UpdateMovie(id, body));
    } catch (error) {
      next(error);
    }
  });
};

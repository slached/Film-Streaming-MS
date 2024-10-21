const CustomerService = require("../service/customer_service");
const {
  SignUpValidator,
  SignInValidator,
  Auth,
  MultipleUserCreateValidator,
  DeleteUserValidator,
  UpdateUserValidator,
  UploadS3Validator,
  MulterSingle,
  DeleteAndInsertToWatchHistoryValidator,
} = require("./middlewares");
const { STATUS_CODES, BadContentError, NotFoundError } = require("../util/errors/app-errors");
const { Client, Server } = require("../util");

module.exports = async (app, channel) => {
  const customerService = new CustomerService();
  Server(channel, customerService);
  // get all customer information
  app.get("/", Auth, async (req, res, next) => {
    try {
      const customers = await customerService.GetCustomers();
      res.status(STATUS_CODES.OK).json(customers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/:id", Auth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const customer = await customerService.GetCustomerById(id);
      res.status(STATUS_CODES.OK).json(customer);
    } catch (error) {
      next(error);
    }
  });

  app.post("/watchHistory", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const historyMovieId = (await customerService.GetCustomerById(_id)).watchHistory;
      res.status(STATUS_CODES.OK).json(historyMovieId);
    } catch (error) {
      next(error);
    }
  });

  app.post("/addToWatchHistory", Auth, DeleteAndInsertToWatchHistoryValidator, async (req, res, next) => {
    try {
      // first validate the body
      const { _id } = req.user;
      const { movieId } = req.body;
      // check from movie services if this movie a valid movie
      const payload = { data: { movieId: movieId }, serviceName: "IsValidMovie" };
      // here we use movie service via rabbitMQ
      const isValidMovieId = await Client(channel, "MOVIE_RPC_QUEUE", payload);
      if (isValidMovieId) {
        res.status(STATUS_CODES.OK).json(await customerService.AddToWatchHistory(_id, movieId));
      } else {
        throw new NotFoundError("Movie is not exists");
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/signUp", SignUpValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signUpBody = req.body;
      const newCustomer = await customerService.SignUp(signUpBody);
      res.status(STATUS_CODES.OK).json(newCustomer);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signIn", SignInValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signInBody = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.LogIn(signInBody));
    } catch (error) {
      next(error);
    }
  });

  app.post("/createMultiple", Auth, MultipleUserCreateValidator, async (req, res, next) => {
    try {
      // first validate the body
      const customers = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.CreateMultipleCustomer(customers));
    } catch (error) {
      next(error);
    }
  });

  app.post("/uploadProfileImage", Auth, MulterSingle, UploadS3Validator, async (req, res, next) => {
    try {
      // first validate the body
      const user = req.user;
      const image = req.file;
      res.status(STATUS_CODES.OK).json(await customerService.UploadImageToS3(user, image));
    } catch (error) {
      next(error);
    }
  });

  app.post("/getUploadedProfileImages", Auth, async (req, res, next) => {
    try {
      const user = req.user;
      res.status(STATUS_CODES.OK).json(await customerService.GetUserImageFromS3(user));
    } catch (error) {
      next(error);
    }
  });

  app.put("/update", Auth, UpdateUserValidator, async (req, res, next) => {
    try {
      // first validate the body
      const { id, body } = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.UpdateCustomer(id, body));
    } catch (error) {
      next(error);
    }
  });

  app.delete("/deleteByEmail", Auth, DeleteUserValidator, async (req, res, next) => {
    try {
      // first validate the body
      const body = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.DeleteCustomer(body));
    } catch (error) {
      next(error);
    }
  });

  app.delete("/deleteFromWatchHistory", Auth, DeleteAndInsertToWatchHistoryValidator, async (req, res, next) => {
    try {
      // first validate the body
      const { _id } = req.user;
      const { movieId } = req.body;
      const isThereAnyMovieInsideOfWatchHistory = (await customerService.GetWatchHistoryByMovieId(movieId)).length > 0;
      if (isThereAnyMovieInsideOfWatchHistory) {
        res.status(STATUS_CODES.OK).json(await customerService.DeleteFromWatchHistory(_id, movieId));
      } else {
        throw new NotFoundError("This movie does not inside of watch history");
      }
    } catch (error) {
      next(error);
    }
  });
};

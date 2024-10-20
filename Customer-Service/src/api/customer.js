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
} = require("./middlewares");
const { STATUS_CODES } = require("../util/errors/app-errors");

module.exports = async (app) => {
  const customerService = new CustomerService();
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

  app.post("/createMultipleCustomer", Auth, MultipleUserCreateValidator, async (req, res, next) => {
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

  app.put("/updateCustomer", Auth, UpdateUserValidator, async (req, res, next) => {
    try {
      // first validate the body
      const { id, body } = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.UpdateCustomer(id, body));
    } catch (error) {
      next(error);
    }
  });

  app.delete("/deleteCustomerByEmail", Auth, DeleteUserValidator, async (req, res, next) => {
    try {
      // first validate the body
      const body = req.body;
      res.status(STATUS_CODES.OK).json(await customerService.DeleteCustomer(body));
    } catch (error) {
      next(error);
    }
  });
};

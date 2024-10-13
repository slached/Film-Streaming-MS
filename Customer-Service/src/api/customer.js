const CustomerService = require("../service/customer_service");
const { SignUpValidator, SignInValidator, Auth, MultipleUserCreateValidator, DeleteUserValidator } = require("./middlewares");

module.exports = async (app) => {
  const customerService = new CustomerService();
  // get all customer information
  app.get("/", Auth, async (req, res, next) => {
    try {
      // get customer from redis if on cache
      const customers = await customerService.GetCustomers();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signUp", SignUpValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signUpBody = req.body;
      const newCustomer = await customerService.SignUp(signUpBody);
      res.status(200).json(newCustomer);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signIn", SignInValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signInBody = req.body;
      res.status(200).json(await customerService.LogIn(signInBody));
    } catch (error) {
      next(error);
    }
  });

  app.post("/createMultipleCustomer", MultipleUserCreateValidator, async (req, res, next) => {
    try {
      // first validate the body
      const customers = req.body;
      res.status(200).json(await customerService.CreateMultipleCustomer(customers));
    } catch (error) {
      next(error);
    }
  });

  app.delete("/deleteCustomerByEmail", DeleteUserValidator, async (req, res, next) => {
    try {
      // first validate the body
      const body = req.body;
      res.status(200).json(await customerService.DeleteCustomer(body));
    } catch (error) {
      next(error);
    }
  });
};

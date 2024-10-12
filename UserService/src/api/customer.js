const CustomerService = require("../service/customer_service");
const { singInValidator, singUpValidator } = require("./middlewares/customer_validation");
const set_or_get_redis = require("./middlewares/set_or_get_redis");

module.exports = async (app) => {
  const customerService = new CustomerService();

  app.get("/", async (req, res, next) => {
    try {
      // get customer from redis if on cache
      const customers = await set_or_get_redis("customers", customerService.GetCustomers);
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signUp", singUpValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signUpBody = req.body;
      const newCustomer = await customerService.SignUp(signUpBody);
      res.status(200).json(newCustomer);
    } catch (error) {
      next(error);
    }
  });

  app.post("/signIn", singInValidator, async (req, res, next) => {
    try {
      // first validate the body
      const signInBody = req.body;
      res.status(200).json(await customerService.LogIn(signInBody,req));
    } catch (error) {
      next(error);
    }
  });
};

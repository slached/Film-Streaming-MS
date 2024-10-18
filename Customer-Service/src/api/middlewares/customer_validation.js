const {
  signUpSchema,
  signInSchema,
  multipleUserSchema,
  deleteUserSchema,
  updateUserSchema,
} = require("../../validation/customer_validation");

// this validates the body according to validation
// if there is an issue in body it's convert body to required shape
const singUpValidator = (req, res, next) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  next();
};

const singInValidator = (req, res, next) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  next();
};

const multipleUserCreateValidator = (req, res, next) => {
  const { error, value } = multipleUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  next();
};

const deleteCustomerValidator = (req, res, next) => {
  const { error, value } = deleteUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};

const updateCustomerValidator = (req, res, next) => {
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
};
module.exports = {
  singUpValidator,
  singInValidator,
  multipleUserCreateValidator,
  deleteCustomerValidator,
  updateCustomerValidator,
};

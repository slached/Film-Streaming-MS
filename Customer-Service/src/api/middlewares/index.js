module.exports = {
  Auth: require("./auth"),
  SignUpValidator: require("./customer_validation").singUpValidator,
  SignInValidator: require("./customer_validation").singInValidator,
  MultipleUserCreateValidator: require("./customer_validation").multipleUserCreateValidator,
  DeleteUserValidator: require("./customer_validation").deleteCustomerValidator,
  UpdateUserValidator: require("./customer_validation").updateCustomerValidator,
};

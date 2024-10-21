module.exports = {
  Auth: require("./auth"),
  MulterSingle: require("./multer"),
  SignUpValidator: require("./customer_validation").singUpValidator,
  SignInValidator: require("./customer_validation").singInValidator,
  MultipleUserCreateValidator: require("./customer_validation").multipleUserCreateValidator,
  DeleteUserValidator: require("./customer_validation").deleteCustomerValidator,
  UpdateUserValidator: require("./customer_validation").updateCustomerValidator,
  UploadS3Validator: require("./customer_validation").uploadS3Validator,
  DeleteAndInsertToWatchHistoryValidator: require("./customer_validation").deleteAndInsertToWatchHistoryValidator,
};

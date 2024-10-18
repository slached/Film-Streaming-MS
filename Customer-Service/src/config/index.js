const StringCheck = (env_name) => {
  return typeof process.env[env_name] === "string" ? process.env[env_name] : "";
};

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: StringCheck("MONGO_URI"),
  JWT_SECRET: StringCheck("JWT_SECRET"),
  AWS_ACCESS_KEY_ID: StringCheck("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: StringCheck("AWS_SECRET_ACCESS_KEY"),
  AWS_BUCKET_REGION: StringCheck("AWS_BUCKET_REGION"),
  AWS_BUCKET_NAME: StringCheck("AWS_BUCKET_NAME"),
};

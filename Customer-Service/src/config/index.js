module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: typeof process.env.MONGO_URI === "string" ? process.env.MONGO_URI : "",
  JWT_SECRET: typeof process.env.JWT_SECRET === "string" ? process.env.JWT_SECRET : "",
};

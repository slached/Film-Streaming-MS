const winston = require("winston");
const { InternalServerError, UnauthorizedError, BadContentError } = require("./app-errors");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
});

const handleError = (err, req, res, next) => {
  const loggedErrorTypes = [InternalServerError, UnauthorizedError, BadContentError];

  loggedErrorTypes.forEach((loggedError) => {
    if (err instanceof loggedError) {
      const errorParseForLog = `${err.name}-${err.message}`;      
      logger.log({
        private: true,
        level: "error",
        message: `${new Date()}-${errorParseForLog}`,
      });
    }
  });

  return res.status(err.statusCode).json({ errName: err.name, msg: err.message });
};

module.exports = { handleError };

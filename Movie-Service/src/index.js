require("dotenv").config();
require("colors");

const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");

const { PORT } = require("./config");
const { DatabaseConnection } = require("./database");
const { MovieController } = require("./api");
const { initializeRedis, connectToRabbit } = require("./util");
const { handleError } = require("./util/errors/ErrorHandler");

const StartServer = async () => {
  const port = PORT || 5000;

  // Db connection
  await DatabaseConnection()
    .then((res) => {
      console.log(res.blue.underline.bold);
    })
    .catch((err) => {
      console.log(err.message.red.bold);
    });

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    limit: 100, // max 100 ping for each IP
    message: {
      message: "Too many request",
      timeout: "1 minute",
    },
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(limiter);
  app.use(
    // @ts-ignore
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "example.com"],
        },
      },
    })
  );
  app.use(morgan("dev"));

  // initialize redis
  await initializeRedis()
    .then((res) => {
      console.log(res.magenta.underline.bold);
    })
    .catch((err) => {
      console.log(err);
    });

  // initialize rabbitMQ
  const channel = await connectToRabbit()
    .then((res) => {
      console.log("RabbitMQ connection success.".cyan.underline.bold);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });

  // Controller
  MovieController(app, channel);

  // Error Handler
  app.use(handleError);

  app
    .listen(port)
    .on("listening", () => {
      console.log(`Customer Services Running on port ${port}`.yellow.underline.bold);
    })
    .on("error", (err) => {
      console.log(err);
    });
};

StartServer();

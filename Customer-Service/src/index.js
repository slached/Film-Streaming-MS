require("dotenv").config();
require("colors");

const express = require("express");
const cors = require("cors");
const app = express();

const { PORT } = require("./config");
const { DatabaseConnection } = require("./database");
const { CustomerController } = require("./api");
const { initializeRedis } = require("./util");
const { handleError } = require("./util/errors/ErrorHandler");

const StartServer = async () => {
  const port = PORT || 5000;

  // Db connection
  await DatabaseConnection();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  // initialize redis
  await initializeRedis()
    .then((res) => {
      console.log(res.magenta.underline.bold);
    })
    .catch((err) => {
      console.log(err);
    });

  // Controller
  CustomerController(app);

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

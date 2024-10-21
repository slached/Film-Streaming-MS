const cors = require("cors");
const proxy = require("express-http-proxy");
const express = require("express");

const ServerStart = async () => {
  const PORT = process.env.PORT || 8000;
  const app = express();

  app.use(cors());

  //proxy
  app.use("/customer", proxy("http://localhost:5000"));
  app.use("/movie", proxy("http://localhost:5001"));

  app
    .listen(PORT, () => {
      console.log(`Gateway listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
    });
};

ServerStart();

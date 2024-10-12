const Redis = require("ioredis");
// @ts-ignore
const redisClient = new Redis();
const DEFAULT_EXPIRATION = 60 * 60 * 1000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const initializeRedis = () => {
  return new Promise((resolve, reject) => {

    redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redisClient.on("ready", () => {
      resolve("Redis is ready to use");
    });

    redisClient.on("error", (err) => {
      reject("Redis Connection Error: " + err);
    });

    redisClient.on("end", () => {
      console.log("Redis connection has ended");
    });
  });
};

const generateSalt = async () => {
  return await bcrypt.genSalt();
};

const generateEncryptedData = async (data, salt) => {
  return await bcrypt.hash(data, salt);
};

const verifyData = async (data, encrypted) => {
  return await bcrypt.compare(data, encrypted);
};

const generateJWT = async (payload, req) => {
  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  req.user = payload;
  return token;
};

module.exports = {
  initializeRedis,
  generateSalt,
  generateEncryptedData,
  verifyData,
  generateJWT,
  redisClient,
  DEFAULT_EXPIRATION,
};

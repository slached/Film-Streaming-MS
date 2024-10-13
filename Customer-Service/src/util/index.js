const Redis = require("ioredis");

const DEFAULT_EXPIRATION = 60 * 60;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
let redisClient;

const initializeRedis = () => {
  // choose which db use to redis
  // @ts-ignore
  redisClient = new Redis({
    db: 0,
    host: "localhost",
    port: 6379,
  });

  return new Promise((resolve, reject) => {
    redisClient.on("connect", () => {
      resolve("Redis connected successfully");
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

const generateJWT = async (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

const validateJWT = async (req) => {
  const token = req.get("Authorization");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

const setOrGetFromRedis = async (key, cb) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) reject(err);
      if (data) resolve(JSON.parse(data));
      else {
        const returnData = await cb();
        await redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(returnData));
        resolve(returnData);
      }
    });
  });
};

const updateCache = (key, cb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await cb();
      await redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(data));
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  initializeRedis,
  generateSalt,
  generateEncryptedData,
  verifyData,
  generateJWT,
  validateJWT,
  setOrGetFromRedis,
  updateCache,
};

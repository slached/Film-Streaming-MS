const Redis = require("ioredis");
const amqp = require("amqplib");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const DEFAULT_EXPIRATION = 60 * 60;
const { JWT_SECRET, RABBIT_CONNECTION_URI, RPC_QUEUE_NAME } = require("../config");
const { BadContentError } = require("./errors/app-errors");
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

// RabbitMQ
const connectToRabbit = async () => {
  try {
    const connection = await amqp.connect(RABBIT_CONNECTION_URI);
    return await connection.createChannel();
  } catch (error) {
    throw new BadContentError(error.message);
  }
};

const Server = async (channel, service) => {
  try {
    const queue = await channel.assertQueue(RPC_QUEUE_NAME);

    channel.consume(queue.queue, async (msg) => {
      const msgAsJson = msg?.content !== undefined ? JSON.parse(msg.content.toString()) : {};
      const response = await service.SubscribeService(msgAsJson);
      channel.sendToQueue(msg?.properties.replyTo, Buffer.from(JSON.stringify(response)), {
        correlationId: msg?.properties.correlationId,
      });
      channel.ack(msg);
    });
  } catch (error) {
    throw new BadContentError(error.message);
  }
};

const Client = async (channel, RPC_QUEUE_NAME, payload) => {
  try {
    const correlationId = uuid.v4();
    const exclusiveQueue = await channel.assertQueue("", {
      exclusive: true,
    });

    channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
      correlationId: correlationId,
      replyTo: exclusiveQueue.queue,
    });

    return new Promise((resolve, reject) => {
      channel.consume(exclusiveQueue.queue, async (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          // delete exclusiveQueue after ack
          setTimeout(async () => {
            await channel.deleteQueue(exclusiveQueue.queue);
          }, 500);
          resolve(await JSON.parse(msg.content.toString()));
        } else {
          reject(`An error occurred while getting response from ${RPC_QUEUE_NAME}`);
        }
      });
    });
  } catch (error) {
    throw new BadContentError(error.message);
  }
};

module.exports = {
  initializeRedis,
  validateJWT,
  setOrGetFromRedis,
  updateCache,
  connectToRabbit,
  Server,
  Client,
};

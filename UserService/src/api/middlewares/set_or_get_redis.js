const { redisClient, DEFAULT_EXPIRATION } = require("../../util");

module.exports = async (key, cb) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) reject(err);
      if (data) resolve(JSON.parse(data));
      const returnData = await cb();
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(returnData));
      resolve(returnData);
    });
  });
};

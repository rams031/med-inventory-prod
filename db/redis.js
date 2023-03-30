require("dotenv").config();
const redis = require("redis");
const { connection } = require("./connection");

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const redisConfig = {
  EX: 100, // Expiration
  NX: true, // Writable
};

const inspectCache = async (query) => {
  const redisCacheData = await client.get(query);
  if (redisCacheData) return JSON.parse(redisCacheData);

  return new Promise((resolve) => {
    connection.query(query, async (error, results) => {
      await client.set(query, JSON.stringify({ error, results }), redisConfig);
      resolve({ error, results });
    });
  });
};

module.exports = { client, redisConfig, inspectCache };

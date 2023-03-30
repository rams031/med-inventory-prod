require("dotenv").config();
const { createClient } = require("redis");
const { connection } = require("./connection");

const client = createClient({
  url: process.env.REDIS_URL,
});

const redisConfig = {
  EX: 10, // Expiration
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

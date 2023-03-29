require("dotenv").config();
const redis = require("redis");
const { connection } = require("./connection");

const client = redis.createClient({
  url: "rediss://red-cg9tsv02qv25khj58reg:Z6fZLlDIzaqupc6NdaE6QhGVKWg0pK7A@singapore-redis.render.com:6379",
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

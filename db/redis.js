require("dotenv").config();
const redis = require("redis");
const { connection } = require("./connection");

const client = redis.createClient({
    password: 'MVpYGc4bW8654L6VS5PzuKpjrt5q3gJo',
    socket: {
        host: 'redis-16518.c14.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16518
    }
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

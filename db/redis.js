require("dotenv").config();
const crypto = require("crypto");
const { createClient } = require("redis");
var jwt = require("jsonwebtoken");

const { connection } = require("./connection");

const client = createClient({
  url: process.env.REDIS_URL,
});

const redisConfig = {
  EX: 86400, // Expiration
  NX: true, // Writable
};

const stringToHash = (data) =>
  crypto.createHash("md5").update(data).digest("base64");

const inspectCache = async (key, query) => {
  const queryHash = stringToHash(query);
  const keyHash = stringToHash(key);
  const redisCacheData = await client.hGet(keyHash, queryHash);

  if (redisCacheData) {
    var decodedCache = jwt.verify(redisCacheData, "secret");
    return decodedCache?.data;
  }

  return new Promise((resolve) => {
    connection.query(query, async (error, results) => {
      const encoded = jwt.sign({ data: { error, results } }, "secret");

      await client
        .hSet(
          keyHash,
          queryHash,
          encoded
          // redisConfig
        )
        .then((res) => console.log("res", res));
      return resolve({ error, results });
    });
  });
};

const clearCache = (key) => {
  const hashKey = stringToHash(key);
  console.log(`hashKey key clear:`, hashKey);
  return client.del(hashKey).then((res) => console.log("res", res));
};

module.exports = { client, redisConfig, inspectCache, clearCache };

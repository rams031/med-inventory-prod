const router = require("express").Router();
const { client, inspectCache, clearCache } = require("../db/redis");
const { connection } = require("./../db/connection");
const redisKey = "categories";

router.get("/:id", (req, res) => {
  const { id } = req.params || {};
  const barangayKey = `barangayId = ${id}`;
  const query = "SELECT * FROM `categories` WHERE " + barangayKey;

  return inspectCache(redisKey, query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    return res.status(200).json(results);
  });
});

router.post("/create", (req, res) => {
  const { categoryName, barangayId } = req?.body || {};

  return connection.query(
    {
      sql: "INSERT INTO `categories`(`name`, `barangayId`) VALUES (?,?)",
      values: [categoryName, barangayId],
    },
    function (error, results, fields) {
      if (error) return res.send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

router.post("/update", (req, res) => {
  const { categoryName, categoryId } = req.body || {};

  return connection.query(
    {
      sql: "UPDATE `categories` SET `name`=? WHERE id=?",
      values: [categoryName, categoryId],
    },
    function (error, results, fields) {
      console.log(`error:`, error);
      if (error) return res.send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

router.post("/delete", (req, res) => {
  const { categoryId } = req?.body || {};

  return connection.query(
    {
      sql: "DELETE FROM `categories` WHERE id=?",
      values: [categoryId],
    },
    function (error, results, fields) {
      if (error) return res.send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

module.exports = router;

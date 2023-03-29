const router = require("express").Router();
const { client, inspectCache } = require("../db/redis");
const { connection } = require("./../db/connection");

router.get("/:id", (req, res) => {
  const { id } = req.params || {};
  const query = `SELECT * FROM 'categories' WHERE barangayId = ${id}`;

  return inspectCache(query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    res.status(200).json(results);
    return client.flushAll();
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
      return client.flushAll();
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
      return client.flushAll();
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
      return client.flushAll();
    }
  );
});

module.exports = router;

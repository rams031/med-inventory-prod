const router = require("express").Router();
const { client, inspectCache, clearCache } = require("../db/redis");
const { connection } = require("./../db/connection");
const redisKey = "accounts";

router.get("/", (req, res) => {
  const query =
    "SELECT accounts.*,barangay.barangayName, barangay.barangayLogo  FROM accounts INNER JOIN barangay ON accounts.barangayId=barangay.id";

  return inspectCache(redisKey, query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    return res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params || {};
  const query = `SELECT accounts.*,barangay.barangayName, barangay.barangayLogo  FROM accounts INNER JOIN barangay ON accounts.barangayId=barangay.id WHERE accounts.barangayId = ${id}`;

  return inspectCache(redisKey, query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    return res.status(200).json(results);
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req?.body || {};

  return connection.query(
    {
      sql: "SELECT * FROM `accounts` WHERE username=? && password=?",
      values: [username, password],
    },
    function (error, results, fields) {
      console.log(`results:`, results);
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
});

router.post("/create", (req, res) => {
  const {
    fullname,
    barangayId,
    accountType,
    username,
    password,
    address,
    email,
  } = req?.body || {};

  return connection.query(
    {
      sql: "INSERT INTO `accounts`(`fullname`, `barangayId`, `accountType`, `username`, `password`, `address`, `email`) VALUES (?,?,?,?,?,?,?)",
      values: [
        fullname,
        barangayId,
        accountType,
        username,
        password,
        address,
        email,
      ],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

router.post("/update", (req, res) => {
  const { id, fullname, barangayId, accountType, username, address, email } =
    req?.body || {};

  return connection.query(
    {
      sql: "UPDATE `accounts` SET `barangayId`=?,`accountType`=?,`fullname`=?,`email`=?,`address`=?,`username`=? WHERE id=?",
      values: [barangayId, accountType, fullname, email, address, username, id],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

router.post("/delete", (req, res) => {
  const { categoryId } = req?.body || {};

  return connection.query(
    {
      sql: "DELETE FROM `accounts` WHERE id=?",
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

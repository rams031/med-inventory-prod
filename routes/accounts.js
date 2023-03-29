const router = require("express").Router();
const { client, inspectCache } = require("../db/redis");
const { connection } = require("./../db/connection");

router.get("/", (req, res) => {
  const query =
    "SELECT accounts.*,barangay.barangayName, barangay.barangayLogo  FROM accounts INNER JOIN barangay ON accounts.barangayId=barangay.id";

  return inspectCache(query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params || {};

  return connection.query(
    {
      sql: "SELECT accounts.*,barangay.barangayName, barangay.barangayLogo  FROM accounts INNER JOIN barangay ON accounts.barangayId=barangay.id WHERE accounts.barangayId = ?",
      values: [id],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
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
      return client.flushAll();
    }
  );
});

module.exports = router;

const router = require("express").Router();
const { client, inspectCache, clearCache } = require("../db/redis");
const { connection } = require("./../db/connection");
const redisKey = "barangay";

router.get("/", (req, res) => {
  const query = "SELECT * FROM `barangay`";

  return inspectCache(redisKey, query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    return res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params || {};
  const userKey = `id=${id}`;
  const query = "SELECT * FROM `barangay` WHERE " + userKey;

  return inspectCache(redisKey, query).then(({ error, results }) => {
    if (error) return res.status(400).send(error);
    res.status(200).json(results);
  });
});

router.post("/create", (req, res) => {
  const { barangayLogo, barangayName, barangayDescription, barangayAddress } =
    req?.body || {};

  return connection.query(
    {
      sql: "INSERT INTO `barangay`( `barangayName`, `barangayLogo`, `barangayDescription`, `barangayAddress`) VALUES (?,?,?,?)",
      values: [
        barangayName,
        barangayLogo,
        barangayDescription,
        barangayAddress,
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
  const {
    id,
    barangayName,
    barangayLogo,
    barangayDescription,
    barangayAddress,
  } = req?.body || {};

  return connection.query(
    {
      sql: "UPDATE `barangay` SET `barangayName`=?,`barangayLogo`=?,`barangayDescription`=?,`barangayAddress`=? WHERE `id`=?",
      values: [
        barangayName,
        barangayLogo,
        barangayDescription,
        barangayAddress,
        id,
      ],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

router.post("/delete", (req, res) => {
  const { id } = req?.body || {};

  return connection.query(
    {
      sql: "DELETE FROM `barangay` WHERE id=?",
      values: [id],
    },
    function (error, results, fields) {
      if (error) return res.send(error);
      res.status(200).json(results);
      return clearCache(redisKey);
    }
  );
});

module.exports = router;

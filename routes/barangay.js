const router = require("express").Router();
const { client, inspectCache } = require("../db/redis");
const { connection } = require("./../db/connection");

router.get("/", (req, res) => {
  const query = "SELECT * FROM `barangay`";

  return inspectCache(query).then(({ error, results }) => {
    console.log(`results:`, results);
    console.log(`error:`, error);

    if (error) return res.status(400).send(error);
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params || {};
  const userKey = `id=${id}`;
  const query = "SELECT * FROM `barangay` WHERE " + userKey;

  return inspectCache(query).then(({ error, results }) => {
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
      return client.flushAll();
    }
  );
});

module.exports = router;

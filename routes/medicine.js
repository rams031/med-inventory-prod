const router = require("express").Router();
const { connection } = require("./../db/connection");

router.get("/:id", (req, res) => {
  const { id } = req.params || {};

  return connection.query(
    {
      sql: "SELECT medicines.*, categories.name as categoryName FROM medicines INNER JOIN categories ON medicines.category_id=categories.id WHERE medicines.barangayId = ?",
      values: [id],
    },

    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
});

router.post("/create", (req, res) => {
  const {
    name,
    reference_no,
    category_id,
    expiration,
    quantity,
    strength,
    description,
    image,
    barangayId,
  } = req?.body || {};

  return connection.query(
    {
      sql: "INSERT INTO `medicines`(`reference_no`, `name`, `barangayId`, `strength`, `category_id`, `expiration`, `description`, `quantity`, `image`) VALUES (?,?,?,?,?,?,?,?,?)",
      values: [
        reference_no,
        name,
        barangayId,
        strength,
        category_id,
        expiration,
        description,
        quantity,
        image,
      ],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
});

router.post("/update", (req, res) => {
  const {
    reference_no,
    name,
    strength,
    category_id,
    expiration,
    description,
    quantity,
    image,
    id,
  } = req.body || {};

  return connection.query(
    {
      sql: "UPDATE `medicines` SET `reference_no`=? ,`name`=? ,`strength`=? ,`category_id`=?,`expiration`=?,`description`=?,`quantity`=?,`image`=? WHERE id=?",
      values: [
        reference_no,
        name,
        strength,
        category_id,
        expiration,
        description,
        quantity,
        image,
        id,
      ],
    },
    function (error, results, fields) {
      console.log(`error:`, error);
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
});

router.post("/delete", (req, res) => {
  const { medicineId } = req?.body || {};

  return connection.query(
    {
      sql: "DELETE FROM `medicines` WHERE id=?",
      values: [medicineId],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      res.status(200).json(results);
    }
  );
});

router.post("/deduct", (req, res) => {
  const { id, deductQuantity } = req?.body || {};

  return connection.query(
    {
      sql: "UPDATE `medicines` SET `quantity`= quantity - ? WHERE id=?",
      values: [deductQuantity, id],
    },
    function (error, results, fields) {
      if (error) return res.status(400).send(error);
      // if()
      res.status(200).json(results);
    }
  );
});

module.exports = router;
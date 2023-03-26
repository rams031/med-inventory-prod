var mysql = require("mysql");

var connection = mysql.createPool({
  connectionLimit: 10,
  host: "db4free.net",
  user: "patrick031",
  password: "092359663",
  database: "medinventoryrev",
});

module.exports = { connection };
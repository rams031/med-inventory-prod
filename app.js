const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cronitor = require("cronitor")("4ae4a0429aea445880397090180b32be");
const app = express();
const { connection } = require("./db/connection");
const port = process.env.PORT || 3001;
const monitor = new cronitor.Monitor("Medical Inventory System");

const { client } = require("./db/redis");

(async () => {
  await client.connect();
  client.flushAll();
})();

client.on("error", (err) => console.log("Redis error " + err));
client.on("connect", () => {
  console.log("Redis Connected");
});

client.on("ready", () => {
  console.log("Redis Ready");
});

monitor.ping({ state: "run" });
monitor.ping({ state: "complete" });
monitor.ping({ state: "fail" });

connection.on("acquire", (connection) => {
  console.log("Open Connection %d  ", connection.threadId);
});

connection.on("release", (connection) => {
  console.log("Close Connection %d released", connection.threadId);
});

// Create Connection Action
// connection.getConnection((err) => {
//   if (err) return console.error("error connecting: " + err.stack);
//   return console.log("connected as id " + connection.threadId);
// });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.get("/", (req, res) => res.send("working"));

const AccountRouter = require("./routes/accounts");
const CategoryRouter = require("./routes/category");
const MedicineRouter = require("./routes/medicine");
const ActivityRouter = require("./routes/activity");
const BarangayRouter = require("./routes/barangay");

app.use("/category/", CategoryRouter);
app.use("/medicine/", MedicineRouter);
app.use("/account/", AccountRouter);
app.use("/activity/", AccountRouter);
app.use("/barangay/", BarangayRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

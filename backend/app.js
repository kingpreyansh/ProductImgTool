const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes/index.route");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

app.use("/", routes);
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.listen(3000, () => {
  console.log("server is running : " + 3000);
});

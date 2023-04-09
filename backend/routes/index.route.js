const express = require("express");
const routes = express.Router();

const controller = require("../controller/index.controller");

routes.post("/remove-bg", controller.removeBg);

module.exports = routes;

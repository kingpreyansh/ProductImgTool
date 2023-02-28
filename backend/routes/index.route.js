const express = require("express");
const routes = express.Router();

const controller = require("../controller/index.controller");

const upload = require("../services/image.upload");
  

routes.post("/remove-bg",upload.single('image'), controller.removeBg);



module.exports = routes;
const express = require("express");
const router = express.Router();
const batalhaoController = require("../controllers/batalhao.controller.js");

router.get("/batalhoes", batalhaoController.index);

module.exports = router;
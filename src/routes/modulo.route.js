const express = require("express");
const router = express.Router();
const moduloController = require("../controllers/modulo.controller")

router.get("/modulos", moduloController.index);
module.exports = router;
const express = require("express");
const router = express.Router();
const moduloController = require("../controllers/modulo.controller");

router.get("/modulos", moduloController.index);
router.put("/modulos/:id", moduloController.edit);

module.exports = router;
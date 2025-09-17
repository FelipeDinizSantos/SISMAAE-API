const express = require("express");
const router = express.Router();
const moduloController = require("../controllers/modulo.controller");
const auth = require("../middlewares/auth");

router.get("/modulos", auth, moduloController.index);
router.put("/modulos/:id", auth, moduloController.edit);

module.exports = router;
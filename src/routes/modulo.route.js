const express = require("express");
const router = express.Router();
const moduloController = require("../controllers/modulo.controller");
const auth = require("../middlewares/auth");
const checkPerfil = require("../middlewares/checkPerfil");

router.get("/modulos", auth, moduloController.index);
router.post("/modulos", auth, checkPerfil([1, 3]), moduloController.store);
router.put("/modulos/:id", auth, moduloController.edit);

module.exports = router;
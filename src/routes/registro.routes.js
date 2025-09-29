const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registro.controller.js");
const auth = require("../middlewares/auth");

router.post("/registros", registroController.store);
router.get("/registros/materiais/:id", registroController.materialShow);
router.get("/registros/modulos/:id", registroController.moduloShow);

module.exports = router;
const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registro.controller.js");
const auth = require("../middlewares/auth");

router.post("/registros", auth, registroController.store);
router.get("/registros/materiais/:id", auth, registroController.materialShow);
router.get("/registros/modulos/:id", auth, registroController.moduloShow);

module.exports = router;
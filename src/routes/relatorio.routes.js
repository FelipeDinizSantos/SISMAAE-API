const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorio.controller.js");
const auth = require("../middlewares/auth.js");

router.get("/relatorios/radares/disp-por-regiao", auth, relatorioController.dispPorRegiao);

module.exports = router;
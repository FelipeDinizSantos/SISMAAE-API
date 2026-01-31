const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");

const relatorioController = require("../controllers/relatorio.controller.js");

router.get("/relatorios/disp-por-regiao", auth, relatorioController.dispPorRegiao);
router.get("/relatorios/radares/historico-disp", auth, relatorioController.historicoDisponibilidade);

module.exports = router;
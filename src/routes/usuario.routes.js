const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

router.post("/auth/gerar-senha-hash", usuarioController.gerarHashSenha);
router.post("/auth/login", usuarioController.login);

module.exports = router;
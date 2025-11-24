const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usuarioController = require("../controllers/usuario.controller");

router.post("/auth/register", usuarioController.register);
router.post("/auth/login", usuarioController.login);
router.get("/usuarios/me", auth, usuarioController.me);

module.exports = router;
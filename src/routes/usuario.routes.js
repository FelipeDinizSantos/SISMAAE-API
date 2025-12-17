const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usuarioController = require("../controllers/usuario.controller");
const checkPerfil = require("../middlewares/checkPerfil");

router.post("/auth/register", usuarioController.register);
router.post("/auth/login", usuarioController.login);

router.get("/usuarios/me", auth, usuarioController.me);
router.get("/usuarios", auth, checkPerfil([1, 2]), usuarioController.index);
router.put("/usuarios/:id", auth, checkPerfil([1, 2]), usuarioController.edit);
router.delete("/usuarios/:id", auth, checkPerfil([1, 2]), usuarioController.destroy);

module.exports = router;
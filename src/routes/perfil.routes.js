const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perifl.controller");
const auth = require("../middlewares/auth");

router.get("/perfis", auth, perfilController.index);

module.exports = router;
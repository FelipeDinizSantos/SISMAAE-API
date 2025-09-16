const express = require("express");
const router = express.Router();
const batalhaoController = require("../controllers/batalhao.controller.js");
const auth = require("../middlewares/auth");

router.get("/batalhoes", auth, batalhaoController.index);

module.exports = router;
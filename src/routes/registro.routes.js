const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registro.controller.js");
const auth = require("../middlewares/auth");

router.post("/registros", registroController.store);

module.exports = router;
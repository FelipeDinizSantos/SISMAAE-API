const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth");
const checkPerfil = require("../middlewares/checkPerfil");

router.get("/materiais/", auth, materialController.index);
router.get("/materiais/:id", auth, materialController.show);
router.post("/materiais/", auth, checkPerfil([1, 3]), materialController.store);
router.put("/materiais/:id", auth, materialController.edit);

module.exports = router;
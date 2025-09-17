const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth");

router.get("/materiais", auth, materialController.index);
router.get("/materiais/:id", auth,  materialController.show);
router.put("/materiais/:id", auth,  materialController.edit);

module.exports = router;
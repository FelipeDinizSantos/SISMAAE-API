const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");

router.get("/materiais", materialController.index);
router.get("/materiais/:id", materialController.show);
router.put("/materiais/:id", materialController.edit);

module.exports = router;
const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller")

router.get("/materiais", materialController.index);
router.get("/materiais/:id", materialController.show);
module.exports = router;
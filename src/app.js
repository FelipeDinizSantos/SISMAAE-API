const express = require("express");
const app = express();
const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");

app.use(express.json());

app.use('/api/',materialRoutes);
app.use('/api/',moduloRoutes);

module.exports = app;
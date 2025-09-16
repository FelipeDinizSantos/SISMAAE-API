const express = require("express");
const app = express();

const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");
const batalhoesRoutes = require("./routes/batalhao.routes");

app.use(express.json());

app.use('/api/', materialRoutes);
app.use('/api/', moduloRoutes);
app.use('/api/', batalhoesRoutes);

module.exports = app;
const express = require("express");
const app = express();
const auth = require("./middlewares/auth");

const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");
const batalhoesRoutes = require("./routes/batalhao.routes");
const usuarioRoutes = require("./routes/usuario.routes");

app.use(express.json());

app.use('/api/', materialRoutes);
app.use('/api/', moduloRoutes);
app.use('/api/', batalhoesRoutes);
app.use('/api/', usuarioRoutes);

module.exports = app;
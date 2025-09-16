const express = require("express");
const app = express();
const auth = require("./middlewares/auth");

const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");
const batalhoesRoutes = require("./routes/batalhao.routes");
const usuarioRoutes = require("./routes/usuario.routes");

app.use(express.json());

app.use('/api/', auth, materialRoutes);
app.use('/api/', auth, moduloRoutes);
app.use('/api/', auth, batalhoesRoutes);
app.use('/api/', usuarioRoutes);

module.exports = app;
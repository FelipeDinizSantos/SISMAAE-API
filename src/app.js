const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan');

const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");
const batalhoesRoutes = require("./routes/batalhao.routes");
const usuarioRoutes = require("./routes/usuario.routes");

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms'));

app.use('/api/', materialRoutes);
app.use('/api/', moduloRoutes);
app.use('/api/', batalhoesRoutes);
app.use('/api/', usuarioRoutes);

module.exports = app;
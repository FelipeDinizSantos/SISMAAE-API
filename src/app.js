const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require('morgan');

const materialRoutes = require("./routes/material.routes");
const moduloRoutes = require("./routes/modulo.route");
const batalhoesRoutes = require("./routes/batalhao.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const relatorioRoutes = require("./routes/relatorio.routes");
const resgistroRoutes = require("./routes/registro.routes");
const perfilRoutes = require("./routes/perfil.routes");
const { POSTO_GRADUACOES } = require("./constants");

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms'));

app.use('/api/', materialRoutes);
app.use('/api/', moduloRoutes);
app.use('/api/', batalhoesRoutes);
app.use('/api/', usuarioRoutes);
app.use('/api/', relatorioRoutes);
app.use('/api/', resgistroRoutes);
app.use('/api/', perfilRoutes);
app.use('/api/postos_graduacoes', (req, res) => {
    if (!POSTO_GRADUACOES || POSTO_GRADUACOES.length === 0) {
        return res.status(500).json({ error: "Relação de Postos e Graduações não encontrada!" });
    }

    return res.status(200).json({ postosGraduacoes: POSTO_GRADUACOES });
});


module.exports = app;
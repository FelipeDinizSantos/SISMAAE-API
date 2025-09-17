const pool = require("../config/db")

exports.index = async (req, res) => {
    try {
        const [batalhoes] = await pool.query("SELECT id, nome, sigla FROM batalhoes");

        if(batalhoes.length === 0) return res.status(400).json({erro: "Nenhum batalhão encontrado!"});

        return res.status(200).json({
            batalhoes
        })
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({erro: "Erro durante a busca de batalhões!"});
    }
};
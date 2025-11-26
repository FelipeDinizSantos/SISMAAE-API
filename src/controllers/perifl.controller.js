const pool = require("../config/db")

exports.index = async (req, res) => {
    try {
        const [perfis] = await pool.query("SELECT id, nome FROM perfis");

        if (perfis.length === 0) return res.status(400).json({ erro: "Nenhum perfil encontrado!" });

        return res.status(200).json({
            perfis
        })
    } catch (erro) {
        console.log("controllers/perfil: \n" + erro);
        return res.status(500).json({ erro: "Erro durante a busca de perfis!" });
    }
};
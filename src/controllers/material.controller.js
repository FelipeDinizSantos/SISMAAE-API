const pool = require("../config/db");

exports.index = async (req, res) => {
    try {
        let [rows] = await pool.query(
            `
            SELECT
                mat.nome AS Material,
                mat.serial_num AS SN,
                mat.status AS Disponibilidade,
                orig_mat.sigla AS OM_Origem,
                loc_mat.sigla AS OM_Atual,
                mat.obs AS Obs
            FROM materiais mat
            LEFT JOIN batalhoes orig_mat ON mat.origem_id = orig_mat.id
            LEFT JOIN batalhoes loc_mat ON mat.loc_id = loc_mat.id;
        `);

        return res.status(200).json({
            resultado: rows
        });
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um erro durante a busca de materiais!" });
    }
}

exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        let [rows] = await pool.query(
        `
            SELECT
                mat.nome AS Material,
                mat.serial_num AS SN,
                mat.status AS Disponibilidade,
                orig_mat.sigla AS OM_Origem,
                loc_mat.sigla AS OM_Atual,
                mat.obs AS Obs
            FROM materiais mat
            LEFT JOIN batalhoes orig_mat ON mat.origem_id = orig_mat.id
            LEFT JOIN batalhoes loc_mat ON mat.loc_id = loc_mat.id
            WHERE mat.id = ?
        `, [id]);

        return res.status(200).json({
            resultado: rows
        });
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um problema durante a busca do material!" });
    }
}

exports.edit = async (req, res) => {
    try {
        const { id } = req.query.id;
        const { observacao, disponibilidade } = req.body;
        const [material] = await pool.query("SELECT id, serial_num FROM materiais WHERE id = ?", [id]);

        if (material.length === 0) return res.status(400).json({ erro: "Material não encontrado!" });

        let campos = [];
        let valores = [];
        if (observacao != undefined) {
            campos.push("obs = ?")
            valores.push(observacao);
        }
        if (disponibilidade != undefined) {
            campos.push("status = ?")
            valores.push(disponibilidade);
        }

        if (campos.length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualizar." });

        let sql = `UPDATE materiais SET ${campos.join(',')} WHERE id = ?`;
        const [resultado] = await pool.query(sql, [...valores, id]);

        return res.status(200).json({
            resultado
        });
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Houve um erro durante a atualização do material!" });
    }
}   
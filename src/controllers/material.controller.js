const pool = require("../config/db")

exports.index = async (req, res) => {
    let [rows] = await pool.query(`
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
}

exports.show = async (req, res) => {
    const {id} = req.params;
    let [rows] = await pool.query(`
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
}
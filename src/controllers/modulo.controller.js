const pool = require("../config/db")

exports.index = async (req, res) => {
    const id = req.query.id;
    const nome = req.query.nome;
    const serialNum = req.query.sN;
    const disp = req.query.disp;
    const origem = req.query.origem;
    const atual = req.query.atual;
    const cabide = req.query.cabide;
    let where = "";
    if(id) {
        where = `WHERE m.id = ${id}`
    }
    if(nome) {
        where = `WHERE m.nome = '${nome}'`
    }
    if(serialNum) {
        where = `WHERE m.serial_num = ${serialNum}`
    }
    if(disp) {
        where = `WHERE m.status = '${disp}'`
    }
     if(origem) {
        where = `WHERE orig_m.sigla = '${origem}'`
    }
    if(atual) {
        where = `WHERE loc_m.sigla = ${atual}`
    }
    if(cabide) {
        where = `WHERE mat.serial_num = '${cabide}'`
    }

    let sql = `
    SELECT
        m.nome AS modulo,
        m.serial_num AS SN,
        m.status AS Disponibilidade,
        orig_m.sigla AS OM_Origem,
        loc_m.sigla AS OM_Atual,
        COALESCE(mat.nome, 'Sem Cabide') AS Material,
        COALESCE(mat.serial_num, 'Sem Cabide') AS SN_do_Cabide,
        mat.status AS Disponibilidade_do_Cabide,
        m.obs AS Obs
        FROM modulos m
        LEFT JOIN materiais mat
	        ON material_id = mat.id
        LEFT JOIN batalhoes orig_m ON m.origem_id = orig_m.id
        LEFT JOIN batalhoes loc_m ON m.loc_id = loc_m.id
        ${where}
    `
    console.log (sql)
    let [rows] = await pool.query(sql);
    return res.status(200).json({
        resultado: rows
    });
}
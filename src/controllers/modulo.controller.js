const pool = require("../config/db")

exports.index = async (req, res) => {
    const { id, nome, sN: serialNum, disp, origem, atual, cabide } = req.query;

    let condicoes = [];
    let valores = [];

    if (id) {
        condicoes.push("m.id = ?");
        valores.push(id);
    }
    if (nome) {
        condicoes.push("m.nome = ?");
        valores.push(nome);
    }
    if (serialNum) {
        condicoes.push("m.serial_num = ?");
        valores.push(serialNum);
    }
    if (disp) {
        condicoes.push("m.status = ?");
        valores.push(disp);
    }
    if (origem) {
        condicoes.push("orig_m.sigla = ?");
        valores.push(origem);
    }
    if (atual) {
        condicoes.push("loc_m.sigla = ?");
        valores.push(atual);
    }
    if (cabide) {
        condicoes.push("mat.serial_num = ?");
        valores.push(cabide);
    }

    let where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

    let sql = `
        SELECT
            m.id, 
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
    `;

    let [rows] = await pool.query(sql, valores);

    return res.status(200).json({
        resultado: rows
    });
};


exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { observacao, disponibilidade, cabideId } = req.body;

        const [modulo] = await pool.query("SELECT id, serial_num FROM modulos WHERE id = ?", [id]);
        if (modulo.length === 0) return res.status(400).json({ erro: "Modulo não encontrado!" });

        let campos = [];
        let valores = [];
        if (observacao !== undefined) {
            campos.push("obs = ?");
            valores.push(observacao);
        }
        if (disponibilidade !== undefined) {
            campos.push("status = ?");
            valores.push(disponibilidade);
        }
        if (cabideId !== undefined) {
            const [materialRows] = await pool.query("SELECT id, serial_num FROM materiais WHERE id = ?", [cabideId]);
            if (materialRows.length === 0) return res.status(400).json({ erro: "Cabide não encontrado!" });

            campos.push("material_id = ?");
            valores.push(cabideId);
        }

        if (campos.length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualizar." });

        const sql = `UPDATE modulos SET ${campos.join(", ")} WHERE id = ?`;
        const [resultado] = await pool.query(sql, [...valores, id]);
        return res.status(200).json({ resultado });
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({erro: "Houve um erro durante a atualização do modulo!"});
    }
}
const pool = require("../config/db")

exports.index = async (req, res) => {
    try {
        const { id, nome, sN: serialNum, disp, origem, atual, cabide } = req.query;

        let condicoes = [];
        let valores = [];

        if (id !== undefined) {
            condicoes.push("m.id = ?");
            valores.push(id);
        }
        if (nome !== undefined) {
            condicoes.push("m.nome = ?");
            valores.push(nome);
        }
        if (serialNum !== undefined) {
            condicoes.push("m.serial_num = ?");
            valores.push(serialNum);
        }
        if (disp !== undefined) {
            condicoes.push("m.status = ?");
            valores.push(disp);
        }
        if (origem !== undefined) {
            condicoes.push("orig_m.sigla = ?");
            valores.push(origem);
        }
        if (atual !== undefined) {
            condicoes.push("loc_m.sigla = ?");
            valores.push(atual);
        }
        if (cabide !== undefined) {
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
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um erro durante a busca dos modulos!" });
    }
};

exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { observacao, disponibilidade, cabideSN, omOrigemId, omDestinoId } = req.body;

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
        if (cabideSN !== undefined) {
            const [materialRows] = await pool.query("SELECT id, serial_num FROM materiais WHERE serial_num = ?", [cabideSN]);
            if (materialRows.length === 0) return res.status(400).json({ erro: "Cabide não encontrado!" });

            campos.push("material_id = ?");
            valores.push(materialRows[0].id);
        }
        if(omOrigemId !== undefined){

            const [omRows] = await pool.query("SELECT id, nome FROM batalhoes WHERE id = ?", [omOrigemId]);
            if (omRows.length === 0) return res.status(400).json({ erro: "OM de origem não encontrada!" });

            campos.push("origem_id = ?");
            valores.push(omOrigemId);
        }
        if(omDestinoId !== undefined){
            const [omRows] = await pool.query("SELECT id, nome FROM batalhoes WHERE id = ?", [omDestinoId]);
            if (omRows.length === 0) return res.status(400).json({ erro: "OM de destino não encontrada!" });

            campos.push("loc_id = ?");
            valores.push(omDestinoId);
        }

        if (campos.length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualizar." });

        const sql = `UPDATE modulos SET ${campos.join(", ")} WHERE id = ?`;
        console.log(sql);
        const [resultado] = await pool.query(sql, [...valores, id]);
        return res.status(200).json({ resultado });
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Houve um erro durante a atualização do modulo!" });
    }
}
const pool = require("../../config/db");

module.exports = {

    materiais_index: async (usuario, dadosQuery, tipo) => {
        try {
            const { atual, disponibilidade } = dadosQuery;

            let condicoes = [];
            let valores = [];

            if (atual !== undefined) {
                condicoes.push("loc_mat.sigla = ?");
                valores.push(atual);
            }
            if (disponibilidade !== undefined) {
                condicoes.push("mat.status = ?");
                valores.push(disponibilidade);
            }
            if (tipo !== undefined) {
                condicoes.push("mat.nome = ?");
                valores.push(tipo);
            }

            let where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

            let sql =
                `
                SELECT
                    mat.id,
                    mat.nome AS Material,
                    mat.serial_num AS SN,
                    mat.status AS Disponibilidade,
                    orig_mat.sigla AS OM_Origem,
                    loc_mat.sigla AS OM_Atual,
                    mat.obs AS Obs
                FROM materiais mat
                LEFT JOIN batalhoes orig_mat ON mat.origem_id = orig_mat.id
                LEFT JOIN batalhoes loc_mat ON mat.loc_id = loc_mat.id
                ${where}
                ORDER BY 
                    CASE 
                        WHEN mat.nome = 'RADAR' THEN 1
                        WHEN mat.nome = 'RBS70' THEN 2
                        ELSE 3
                    END,
                    mat.serial_num;
            `;

            let [resultado] = await pool.query(sql, valores);

            return resultado;
        } catch (erro) {
            console.erro(erro);
            throw new Error("Houve um erro durante a busca de materiais!");
        }
    },

    modulos_index: async (usuario, dadosQuery, tipo) => {
        try {
            const { id, modulo, sN: serialNum, disp, origem, atual, cabide } = dadosQuery;

            let condicoes = [];
            let valores = [];

            if (id !== undefined) {
                condicoes.push("m.id = ?");
                valores.push(id);
            }
            if (modulo !== undefined) {
                condicoes.push("m.nome = ?");
                valores.push(modulo);
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
            if (tipo !== undefined) {
                condicoes.push("m.pertence = ?");
                valores.push(tipo);
            }

            let where = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

            let sql =
                `
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
                ORDER BY m.serial_num; 
            `;

            let [resultado] = await pool.query(sql, valores);

            return resultado;
        } catch (erro) {
            throw new Error("Houve um erro durante a busca de modulos!");
        }
    },
}
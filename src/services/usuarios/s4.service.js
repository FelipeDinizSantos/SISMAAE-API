const { CAMPOS_EDITAVEIS_MATERIAIS, CAMPOS_EDITAVEIS_MODULOS } = require("../../constants/perfis");
const pool = require("../../config/db");

module.exports = {
    materiais_index: async (usuario) => {
        try {
            let [rows] = await pool.query(
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
                WHERE mat.origem_id = ? OR mat.loc_id = ?;
            `, [usuario.batalhaoId, usuario.batalhaoId]);

            return rows;
        } catch (erro) {
            console.log(erro);
            throw new Error("Houve um erro durante a busca de materiais!");
        }
    },

    modulos_index: async (usuario, dadosQuery) => {
        try {
            const { id, nome, sN: serialNum, disp, origem, atual, cabide } = dadosQuery;

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

            let where = condicoes.length > 0 ? `WHERE m.loc_id = ? AND ${condicoes.join(" AND ")}` : `WHERE m.loc_id = ?`;

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
            `;

            let [resultado] = await pool.query(sql, [usuario.batalhaoId, ...valores]);

            return resultado;
        } catch (erro) {
            console.log(erro);
            throw new Error("Houve um erro durante a busca de modulos!");
        }
    },

    materiais_show: async (id, usuario) => {
        let [material] = await pool.query(
        `
            SELECT
                mat.nome AS Material,
                mat.serial_num AS SN,
                mat.status AS Disponibilidade,
                origem_id,
                orig_mat.sigla AS OM_Origem,
                mat.loc_id, 
                loc_mat.sigla AS OM_Atual,
                mat.obs AS Obs
            FROM materiais mat
            LEFT JOIN batalhoes orig_mat ON mat.origem_id = orig_mat.id
            LEFT JOIN batalhoes loc_mat ON mat.loc_id = loc_mat.id
            WHERE mat.id = ?
        `, [id]);
        
        if(material.length === 0) return "Nenhum material encontrado.";

        if (material[0].loc_id !== usuario.batalhaoId && material[0].origem_id !== usuario.batalhaoId) return "Usuário não têm permissão para visualizar este material.";
        return material;
    },

    materiais_edit: async (usuario, dados, id) => {
        try {
            const [materiais] = await pool.query("SELECT id, origem_id, loc_id FROM materiais WHERE id = ?", [id]);
            if (materiais.length === 0) return res.status(400).json({ erro: "Material não encontrado!" });

            const material = materiais[0];

            if (material.origem_id !== usuario.batalhaoId || material.loc_id !== usuario.batalhaoId) return "Usuário atual não tem permissão para editar este material.";

            const permitidos = CAMPOS_EDITAVEIS_MATERIAIS[usuario.perfilId] || [];
            let campos = [];
            let valores = [];

            for (const [campo, valor] of Object.entries(dados)) {
                if (permitidos.includes(campo) && valor !== undefined) {
                    campos.push(`${campo} = ?`);
                    valores.push(valor);
                }
            }
            if (campos.length === 0) {
                return "Nenhuma edição permitida para este perfil.";
            }

            const sql = `UPDATE materiais SET ${campos.join(", ")} WHERE id = ?`;
            const [resultado] = await pool.query(sql, [...valores, id]);

            return resultado;
        } catch (error) {
            console.log(error);
            throw new Error("Houve um erro durante a atualização do material!");
        }
    },

    modulos_edit: async (usuario, dados, id) => {
        try {
            const [modulos] = await pool.query("SELECT id, origem_id, loc_id FROM modulos WHERE id = ?", [id]);
            if (modulos.length === 0) return res.status(400).json({ erro: "Modulo não encontrado!" });

            const modulo = modulos[0];

            if (modulo.loc_id !== usuario.batalhaoId) return "Usuário atual não tem permissão para editar este modulo.";

            const permitidos = CAMPOS_EDITAVEIS_MODULOS[usuario.perfilId] || [];
            let campos = [];
            let valores = [];

            for (const [campo, valor] of Object.entries(dados)) {
                if (campo === 'isSemCabide' && valor === true) {
                    campos.push(`material_id = NULL`);
                }
                if (permitidos.includes(campo) && valor !== undefined) {
                    if (campo === "material_id") {
                        if (!campos.includes(`material_id = NULL`)) {
                            campos.push(`${campo} = ?`);
                            valores.push(valor);
                        }
                    } else {
                        campos.push(`${campo} = ?`);
                        valores.push(valor);
                    }
                }
            }
            if (campos.length === 0) {
                return "Nenhuma edição permitida para este perfil.";
            }

            const sql = `UPDATE modulos SET ${campos.join(", ")} WHERE id = ?`;
            const [resultado] = await pool.query(sql, [...valores, id]);

            return resultado;
        } catch (error) {
            console.log(error);
            throw new Error("Houve um erro durante a atualização do modulo!");
        }
    },
}
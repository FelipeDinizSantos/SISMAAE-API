const { CAMPOS_EDITAVEIS_MATERIAIS } = require("../../constants/perfis");
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
                WHERE mat.loc_id = ?;
            `, [usuario.batalhaoId]);

            return rows;
        } catch (erro) {
            console.log(erro);
            throw new Error("Houve um erro durante a busca de materiais!");
        }
    },

    materiais_edit: async (usuario, dados, id) => {
        try {
            const [materiais] = await pool.query("SELECT id, loc_id FROM materiais WHERE id = ?", [id]);
            if (materiais.length === 0) return res.status(400).json({ erro: "Material não encontrado!" });

            const material = materiais[0];

            if(material.loc_id !== usuario.batalhaoId) return "Usuário atual não tem permissão para editar este material.";

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
}
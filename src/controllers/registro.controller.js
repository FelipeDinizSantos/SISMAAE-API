const pool = require("../config/db");
const { PERFIS } = require("../constants/perfis");

exports.store = async (req, res) => {
    const dados = req.body;

    try {
        const campos = [];
        const valores = [];

        for (const [campo, valor] of Object.entries(dados)) {
            if (valor === undefined || valor === null) continue;

            if (campo === "mecanico_id") {
                const [[usuario]] = await pool.query(
                    "SELECT id, perfil_id FROM usuarios WHERE id = ?",
                    [valor]
                );
                if (!usuario || ![PERFIS.MECANICO, PERFIS.COL].includes(usuario.perfil_id)) {
                    return res.status(400).json({
                        erro: "Usuário não encontrado ou perfil incorrespondente.",
                    });
                }
            }

            campos.push(campo);
            valores.push(valor);
        }

        if (campos.length === 0) {
            return res.status(400).json({ erro: "Nenhum campo válido informado." });
        }

        const sql = `
          INSERT INTO registros (${campos.join(", ")})
          VALUES (${valores.map(() => "?").join(", ")})
        `;

        await pool.query(sql, valores);

        return res.status(200).json({ resultado: "Registro gerado com sucesso." });
    } catch (error) {
        return res.status(400).json({ erro: "Erro ao gerar registro!" });
    }
};

exports.materialShow = async (req, res) => {
    const { id } = req.params;

    try {
        let [registros] = await pool.query(
            `
            SELECT 
                r.id,
                r.material_id,
                r.acao,
                r.automatico,
                r.mecanico_id,
                r.created_at AS data, 
                u.pg AS mecanico_posto,
                u.nome AS mecanico_nome,
                p.nome AS perfil,
                b.sigla AS mecanico_batalhao 
            FROM registros r
            LEFT JOIN usuarios u 
                ON r.mecanico_id = u.id
            LEFT JOIN perfis p 
                ON u.perfil_id = p.id 
            LEFT JOIN batalhoes b
                ON u.batalhao_id = b.id
            WHERE r.material_id = ?
            ORDER BY r.created_at DESC
        `, [id]);

        res.status(200).json({ registros })
    } catch (error) {
        return res.status(400).json({ erro: "Erro ao buscar registros!" })
    }
};

exports.moduloShow = async (req, res) => {
    const { id } = req.params;

    try {
        let [registros] = await pool.query(
            `
            SELECT 
                r.id,
                r.modulo_id,
                r.acao,
                r.automatico,
                r.mecanico_id,
                r.created_at AS data, 
                u.pg AS mecanico_posto,
                u.nome AS mecanico_nome,
                p.nome AS perfil,
                b.nome AS mecanico_batalhao  
            FROM registros r
            LEFT JOIN usuarios u 
                ON r.mecanico_id = u.id
            LEFT JOIN perfis p 
                ON u.perfil_id = p.id
            LEFT JOIN batalhoes b
                ON u.batalhao_id = b.id
            WHERE r.modulo_id = ?
            ORDER BY r.created_at DESC;
        `, [id]);

        res.status(200).json({ registros })
    } catch (error) {
        return res.status(400).json({ erro: "Erro ao buscar registros!" })
    }
}; 
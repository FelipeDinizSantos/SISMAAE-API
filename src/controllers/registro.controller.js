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
                const [[mecanico]] = await pool.query(
                    "SELECT id, perfil_id FROM usuarios WHERE id = ?",
                    [valor]
                );
                if (!mecanico || mecanico.perfil_id !== PERFIS.MECANICO) {
                    return res.status(400).json({
                        Erro: "Mecânico não encontrado ou perfil incorrespondente.",
                    });
                }
            }

            campos.push(campo);
            valores.push(valor);
        }

        if (campos.length === 0) {
            return res.status(400).json({ Erro: "Nenhum campo válido informado." });
        }

        const sql = `
          INSERT INTO registros (${campos.join(", ")})
          VALUES (${valores.map(() => "?").join(", ")})
        `;

        await pool.query(sql, valores);

        return res.status(200).json({ Resultado: "Registro gerado com sucesso." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ Erro: "Erro ao gerar registro!" });
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
                u.nome AS mecanico_nome
            FROM registros r
            LEFT JOIN usuarios u 
                ON r.mecanico_id = u.id
            WHERE r.material_id = ?;
        `, [id]);

        res.status(200).json({ Registros: registros })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ Erro: "Erro ao buscar registros!" })
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
                u.pg AS mecanico_posto,
                u.nome AS mecanico_nome
            FROM registros r
            LEFT JOIN usuarios u 
                ON r.mecanico_id = u.id
            WHERE r.modulo_id = ?;
        `, [id]);

        res.status(200).json({ Registros: registros })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ Erro: "Erro ao buscar registros!" })
    }
}; 
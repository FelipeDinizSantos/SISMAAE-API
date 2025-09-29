const pool = require("../config/db");
const { PERFIS } = require("../constants/perfis");

exports.store = async (req, res) => {
    const dados = req.body;

    console.log(dados);

    try {
        const campos = [];
        const valores = [];
        for (const [campo, valor] of Object.entries(dados)) {
            if (campo === "mecanico_id") {
                // Verificação do mecanico 
                const [[mecanico]] = await pool.query("SELECT id, perfil_id FROM usuarios WHERE id = ?", [campo]);

                console.log(mecanico);

                if (mecanico || mecanico.perfil_id !== PERFIS.MECANICO) res.status(400).json({ Erro: "Mecânico não encontrado ou perfil incorrespondente." });
            }

            campos.push(campo);
            valores.push(valor);
        }

        const sql = `INSERT registros (${campos.join(", ")}) VALUES (${valores.map(() => '(?, ?, ?)').join(',')})`;
        
        console.log(sql);
        
        await pool.query(sql, valores);

        return res.status(200).json({ Resultado: "Registro gerado com sucesso." });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ Erro: "Erro ao gerar registro!" });
    }
};
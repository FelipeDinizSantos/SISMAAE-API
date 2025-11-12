const pool = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

exports.dispPorRegiao = async (req, res) => {
    try {
        let sql = `
            SELECT 
            b.regiao AS nome,
            CAST(COUNT(m.id) AS UNSIGNED) AS total,
            CAST(SUM(CASE WHEN m.status IN ('DISPONIVEL', 'DISP_C_RESTRICAO') THEN 1 ELSE 0 END) AS UNSIGNED) AS ativos
            FROM materiais m
            JOIN batalhoes b ON m.loc_id = b.id
            WHERE b.regiao != "MANUTENCAO"
	        GROUP BY b.regiao;
            `
        const [rows] = await pool.query(sql);

        return res.status(200).json({ regioes: rows })

    } catch (erro) {
        console.log("controllers/relatorio: \n" + erro);
        return res.status(400).json({ erro: "buscar relatório de disponibilidade!" });
    }
}

exports.historicoDisponibilidade = async (req, res) => {
    const filePath = path.resolve('src/data/disponibilidade_periodica_radares[mock].json');

    try {
        await fs.access(filePath);

        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (!data.historico || data.historico.length <= 1) {
            return res.status(200).json({
                mensagem: 'Sem dados de amostragem, ainda.',
                historico: []
            });
        }

        return res.status(200).json({
            total_registros: data.historico.length,
            historico: data.historico
        });

    } catch (erro) {
        console.error("controllers/relatorio: \n" + erro);

        if (erro.code === 'ENOENT') {
            return res.status(404).json({
                erro: 'Arquivo de disponibilidade ainda não foi gerado.'
            });
        }
        return res.status(500).json({
            erro: 'Erro interno ao acessar dados de disponibilidade.'
        });
    }
}

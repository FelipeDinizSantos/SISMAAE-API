const pool = require("../config/db");

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

        return res.status(200).json({regioes: rows})

    } catch (error) {
        return res.status(400).json({erro: "Erro ao buscar relatório de disponibilidade!" });
    }
}
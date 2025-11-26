const cron = require("node-cron");
const pool = require("../config/db.js");
const appendHistorico = require("../utils/utilitarioDeArquivoDispPeriodRadares.js")

async function coletarDadosMateriais() {
    try {
        const [rows] = await pool.query(`
            SELECT status, COUNT(*) AS total
            FROM materiais
            WHERE nome = "RADAR" AND deleted_at IS NULL 
            GROUP BY status
        `);

        const resumo = {
            DISPONIVEL: 0,
            DISP_C_RESTRICAO: 0,
            INDISPONIVEL: 0,
            MANUTENCAO: 0
        };

        let totalGeral = 0;
        rows.forEach(r => {
            resumo[r.status] = r.total;
            totalGeral += r.total;
        });

        const entry = {
            timestamp: new Date().toISOString(),
            status: resumo,
            total: totalGeral
        };

        await appendHistorico(entry);
        console.log(`[Scheduler] Registro salvo em ${entry.timestamp}`);

    } catch (err) {
        console.error('[Scheduler] Erro ao coletar dados dos radares:', err);
    }
}

function iniciar() {
    console.log('[Scheduler] Agendador de Histórico de Disponibilidade de Radares iniciado (a cada mês)');
    cron.schedule('0 0 1 * *', coletarDadosMateriais);
}

module.exports = { iniciar }
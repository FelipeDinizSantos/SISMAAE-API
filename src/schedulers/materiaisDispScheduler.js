const cron = require("node-cron");
const pool = require("../config/db.js");
const appendHistorico = require("../utils/utilitarioDeArquivoDispPeriod.js")

async function coletarDadosMateriais() {
    try {
        const resumo = {
            DISPONIVEL: 0,
            DISP_C_RESTRICAO: 0,
            INDISPONIVEL: 0,
            MANUTENCAO: 0
        };

        // Busca e append de arquivo para radares
        const [radarRows] = await pool.query(`
            SELECT status, COUNT(*) AS total
            FROM materiais
            WHERE nome = "RADAR" AND deleted_at IS NULL 
            GROUP BY status
        `);

        let totalGeralRadares = 0;
        radarRows.forEach(r => {
            resumo[r.status] = r.total;
            totalGeralRadares += r.total;
        });

        const radarEntry = {
            timestamp: new Date().toISOString(),
            status: resumo,
            total: totalGeralRadares
        };

        await appendHistorico(radarEntry, "radar");

        // Busca e append de arquivo para rbs70
        const [rbs70Rows] = await pool.query(`
            SELECT status, COUNT(*) AS total
            FROM materiais
            WHERE nome = "RBS70" AND deleted_at IS NULL 
            GROUP BY status
        `);

        let totalGeralRBS70 = 0;
        rbs70Rows.forEach(r => {
            resumo[r.status] = r.total;
            totalGeralRBS70 += r.total;
        });

        const RBS70Entry = {
            timestamp: new Date().toISOString(),
            status: resumo,
            total: totalGeralRBS70
        };

        await appendHistorico(RBS70Entry, "rbs70");

        console.log(`[Scheduler] Registro salvo em ${RBS70Entry.timestamp}`);

    } catch (err) {
        console.error('[Scheduler] Erro ao coletar dados dos radares:', err);
    }
}

function iniciar() {
    console.log('[Scheduler] Agendador de Histórico de Disponibilidade de Radares iniciado (a cada mês)');
    cron.schedule('0 0 1 * *', coletarDadosMateriais); // Rodar todo primeiro dia do mês 
}

module.exports = { iniciar }
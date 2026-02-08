const usuarioServiceFactory = require("../services/usuarios/usuario.service.factory");
const pool = require("../config/db");

exports.store = async (req, res) => {
    const { serial_num, nome, status, origem_id, loc_id, pertence, material_id } = req.body;

    // Validações 
    if (typeof serial_num !== "string" && serial_num.length > 6) {
        return res.status(400).json({ error: 'O número de série do material precisa ser do tipo String e conter no máximo 6 caracteres.' })
    }
    if (!nome) {
        return res.status(400).json({ error: 'Nome do módulo não informado.' });
    }
    const pertenceValido = ["RADAR", "RBS70", "COAAE", "RBS70SIMULADOR", "RBS70 SIMULADOR"].some(n => n === pertence.toUpperCase());
    if (!pertenceValido) {
        return res.status(400).json({ error: 'Material pertencente do módulo inválido. Materiais disponíveis: "RADAR", "RBS70", "COAAE", "RBS70SIMULADOR", "RBS70 SIMULADOR"' })
    }
    const statusValido = ['DISPONIVEL', 'DISP_C_RESTRICAO', 'INDISPONIVEL', 'MANUTENCAO'].some(s => s === status.toUpperCase());
    if (!statusValido) {
        return res.status(400).json({ error: 'Status do material inválido. Status disponíveis: "DISPONIVEL", "DISP_C_RESTRICAO", "INDISPONIVEL", "MANUTENCAO"' });
    }
    if ((await pool.query(
        "SELECT id FROM batalhoes WHERE id = ?",
        [origem_id]))[0].length === 0) {
        return res.status(400).json({ error: 'ID da OM de origem informado não existe!' });
    }
    if ((await pool.query(
        "SELECT id FROM batalhoes WHERE id = ?",
        [loc_id]))[0].length === 0) {
        return res.status(400).json({ error: 'ID da OM atual informado não existe!' });
    }
    if ((await pool.query(
        "SELECT id FROM materiais WHERE id = ?",
        [material_id]))[0].length === 0) {
        return res.status(400).json({ error: 'ID do material qual o módulo pertence informado não existe!' });
    }

    try {
        const [resultado] = await pool.query(`
            INSERT INTO modulos (
                serial_num,
                nome,
                pertence,
                status,
                origem_id,
                loc_id,
                material_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [serial_num.toUpperCase(), nome.toUpperCase(), pertence.toUpperCase() === "RBS70SIMULADOR" ? "RB70 SIMULADOR" : pertence.toUpperCase(), status.toUpperCase(), origem_id, loc_id, material_id]);

        return res.status(201).json({
            id: resultado.insertId,
            serial_num,
            nome,
            pertence,
            status,
            origem_id,
            loc_id,
            material_id
        });

    } catch (erro) {
        console.log("controllers/modulo: \n" + erro);
        return res.status(500).json({ error: 'Erro ao criar módulo.' });
    }
}

exports.index = async (req, res) => {
    const usuario = req.usuario;
    if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

    const tipoMaterial = req.query.materialSelecionado;

    if (tipoMaterial) {
        const tipoValido = ["RBS70", "RADAR", "COAAE"].find(tipo => tipo === tipoMaterial.toUpperCase());
        if (!tipoValido) {
            return res.status(400).json({ erro: "Tipo inválido de material fornecido. Tipos válidos: RBS70, RADAR, COAAE" });
        }
    }

    try {
        const service = usuarioServiceFactory(usuario.perfilId); // Cria o serviço que será consumido 
        const modulos = await service.modulos_index(usuario, req.query, tipoMaterial ? tipoMaterial.toUpperCase() : undefined); // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({
            modulos
        });
    } catch (erro) {
        console.log("controllers/modulo: \n" + erro);

        return res
            .status(erro.status || 500)
            .json({ erro: erro.message || "Houve um erro durante a busca do modulo!" });
    }
};

exports.edit = async (req, res) => {
    const usuario = req.usuario;
    if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

    try {
        const { id } = req.params;

        const service = usuarioServiceFactory(usuario.perfilId);                // Cria o serviço que será consumido 
        const resultado = await service.modulos_edit(usuario, req.body, id);    // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({ resultado });
    } catch (erro) {
        console.log("controllers/modulo: \n" + erro);

        return res
            .status(erro.status || 500)
            .json({ erro: erro.message || "Houve um erro durante a atualização do modulo!" });
    }
}
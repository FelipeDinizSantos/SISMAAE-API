const pool = require("../config/db");
const usuarioServiceFactory = require("../services/usuarios/usuario.service.factory");

exports.index = async (req, res) => {
    const usuario = req.usuario;
    if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

    try {
        const service = usuarioServiceFactory(usuario.perfilId); // Cria o serviço que será consumido 
        const materiais = await service.materiais_index(usuario); // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({
            materiais
        });
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um erro durante a busca de materiais!" });
    }
}

exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        let [rows] = await pool.query(
            `
            SELECT
                mat.nome AS Material,
                mat.serial_num AS SN,
                mat.status AS Disponibilidade,
                orig_mat.sigla AS OM_Origem,
                loc_mat.sigla AS OM_Atual,
                mat.obs AS Obs
            FROM materiais mat
            LEFT JOIN batalhoes orig_mat ON mat.origem_id = orig_mat.id
            LEFT JOIN batalhoes loc_mat ON mat.loc_id = loc_mat.id
            WHERE mat.id = ?
        `, [id]);

        return res.status(200).json({
            resultado: rows
        });
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um problema durante a busca do material!" });
    }
}

exports.edit = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

        const { id } = req.params;
        
        const service = usuarioServiceFactory(usuario.perfilId); // Cria o serviço que será consumido 
        const resposta = await service.materiais_edit(usuario, req.body, id); // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({
            resposta
        });
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Houve um erro durante a atualização do material!" });
    }
}   
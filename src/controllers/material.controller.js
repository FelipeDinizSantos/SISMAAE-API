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
    const usuario = req.usuario;
    if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

    try {
        const { id } = req.params;

        const service = usuarioServiceFactory(usuario.perfilId);    // Cria o serviço que será consumido 
        const material = await service.materiais_show(id, usuario); // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({
            Material: material
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
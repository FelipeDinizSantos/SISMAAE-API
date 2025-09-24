const usuarioServiceFactory = require("../services/usuarios/usuario.service.factory");

exports.index = async (req, res) => {
    const usuario = req.usuario;
    if (!usuario) return res.status(400).json({ erro: "Usuário não foi logado corretamente. Tente novamente!" });

    try {
        const service = usuarioServiceFactory(usuario.perfilId);             // Cria o serviço que será consumido 
        const modulos = await service.modulos_index(usuario, req.query);    // Acessa método deste serviço criado (método padrão entre todos perfis)

        return res.status(200).json({
            modulos: modulos
        });
    } catch (erro) {
        console.log(erro);
        return res.status(400).json({ erro: "Houve um erro durante a busca dos modulos!" });
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
        console.log(erro);
        return res.status(500).json({ erro: "Houve um erro durante a atualização do modulo!" });
    }
}
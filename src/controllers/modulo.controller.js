const usuarioServiceFactory = require("../services/usuarios/usuario.service.factory");

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
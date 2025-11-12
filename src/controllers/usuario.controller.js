const pool = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

exports.gerarHashSenha = async (req, res) => {
    const { senha } = req.body;
    if (!senha) {
        return res.status(400).json({ error: 'A senha deve ser informada!' });
    }

    // const senhaValida = senha.length >= 8 && /[A-Za-z]/.test(senha) && /[0-9]/.test(senha);
    // if (!senhaValida) {
    //     return res.status(400).json({
    //         error: 'A senha deve ter pelo menos 8 caracteres e conter letras e números.'
    //     });
    // }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        res.status(201).json({ hash: senhaHash });
    } catch (erro) {
        console.log("controllers/usuario: \n" + erro);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    const { idtMilitar, senha } = req.body;

    if (!idtMilitar || !senha) {
        return res.status(400).json({ error: 'A identidade militar e senha são obrigatórios.' });
    }

    try {
        const [[usuario]] = await pool.query(
            `
                SELECT u.*, p.nome AS role FROM usuarios u 
<<<<<<< HEAD
                INNER JOIN perfis p ON p.id = u.perfil_id
                WHERE u.idt_militar = ?; 
=======
                INNER JOIN perfis p ON u.perfil_id = p.id
                WHERE idt_militar = ?
>>>>>>> 21526f191be4633a189ced4a8f29657f5eea98e9
            `,
            [idtMilitar]
        );

        if (!usuario) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return res.status(400).json({ error: 'Credenciais inválidas.' });
        }

        const payload = {
            id: usuario.id,
            pg: usuario.pg,
            nome: usuario.nome,
            role: usuario.role,
            idtMilitar: usuario.idt_militar,
            perfilId: usuario.perfil_id,
            batalhaoId: usuario.batalhao_id,
        };

        const token = jwt.sign(payload, authConfig.secret, {
            expiresIn: authConfig.expiresIn
        });

        res.json({ token });
    } catch (erro) {
        console.log("controllers/usuario: \n" + erro);
        res.status(500).json({ error: 'Erro ao realizar login.' });
    }
};

exports.me = async (req, res) => {

    const { id } = req.usuario;

    if (!id) return res.status(400).json({ erro: "ID do usuário não informado!" });

    try {
        let [usuario] = await pool.query(
            `
            SELECT u.id, u.pg, u.nome, u.idt_militar, p.nome AS perfil, b.sigla as batalhao
            FROM usuarios u 
            LEFT JOIN perfis p 
            ON u.perfil_id = p.id    
            LEFT JOIN batalhoes b
            ON b.id = u.batalhao_id  
            WHERE u.id = ?
        `, [id]);

        if (usuario.length === 0) return res.status(400).json({ erro: "Usuário não encontrado!" });

        return res.status(200).json({ resultado: usuario });
    } catch (erro) {
        console.log("controllers/usuario: \n" + erro);
        return res.status(500).json("Houve um erro durante a busca do usuário!");
    }
}
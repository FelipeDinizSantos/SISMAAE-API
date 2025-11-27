const pool = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { POSTO_GRADUACOES } = require("../constants");

exports.register = async (req, res) => {
    const { idtMilitar, pg, senha, email, nome, perfilId, batalhaoId } = req.body;

    // Validações

    if (!idtMilitar) {
        return res.status(400).json({ error: 'Identidade militar não informada!' });
    }
    if ((await pool.query(
        "SELECT id FROM usuarios WHERE idt_militar = ?",
        [idtMilitar]))[0].length !== 0) {
        return res.status(400).json({ error: 'Identidade militar já utilizada!' });
    }
    if (!email) {
        return res.status(400).json({ error: 'E-mail deve ser informado!' })
    }
    if ((await pool.query(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]))[0].length !== 0) {
        return res.status(400).json({ error: 'E-mail já utilizado!' });
    }
    if ((await pool.query(
        "SELECT id FROM batalhoes WHERE id = ?",
        [batalhaoId]))[0].length === 0) {
        return res.status(400).json({ error: 'ID do batalhão informado não existe!' });
    }
    if ((await pool.query(
        "SELECT id FROM perfis WHERE id = ?",
        [perfilId]))[0].length === 0) {
        return res.status(400).json({ error: 'ID do perfil do usuário inválido!' });
    }

    const postoValido = POSTO_GRADUACOES.some(
        p => p.sigla === pg.toUpperCase()
    );

    if (!postoValido) {
        const siglasDisponiveis = POSTO_GRADUACOES.map(p => p.sigla).join(", ");
        return res.status(400).json({
            error: "PG inválido. PGs disponíveis: " + siglasDisponiveis
        });
    }

    if (!senha) {
        return res.status(400).json({ error: 'A senha deve ser informada!' });
    }

    let senhaValida = senha.length >= 8 && /[A-Za-z]/.test(senha) && /[0-9]/.test(senha);

    if (!senhaValida) {
        return res.status(400).json({
            error: 'A senha deve ter pelo menos 8 caracteres e conter letras e números.'
        });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.query(`
            INSERT usuarios (
                pg,
                nome,
                idt_militar,
                email,
                senha_hash,
                perfil_id,
                batalhao_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [pg, nome, idtMilitar, email, senhaHash, perfilId, batalhaoId]);

        return res.status(201).json({ resultado: "Registro criado com sucesso!" });
    } catch (erro) {
        console.log("controllers/usuario: \n" + erro);
        return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
}

exports.login = async (req, res) => {
    const { idtMilitar, senha } = req.body;

    if (!idtMilitar || !senha) {
        return res.status(400).json({ error: 'A identidade militar e senha são obrigatórios.' });
    }

    try {
        const [[usuario]] = await pool.query(
            `
                SELECT u.*, p.nome AS role FROM usuarios u 
                INNER JOIN perfis p ON u.perfil_id = p.id
                WHERE idt_militar = ?
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

exports.index = async (req, res) => {
    try {
        let [usuarios] = await pool.query(`
            SELECT u.id, u.pg, u.nome, u.idt_militar, p.nome AS perfil, b.sigla as batalhao
                FROM usuarios u 
                LEFT JOIN perfis p 
                ON u.perfil_id = p.id    
            LEFT JOIN batalhoes b
                ON b.id = u.batalhao_id  
            ORDER BY u.id
        `)

        if (usuarios.length === 0) return res.status(400).json({ erro: "Usuário não encontrado!" });

        return res.status(200).json({ resultado: usuarios });
    } catch (erro) {
        console.log("controller/usuario \n" + erro);
        return res.status(500).json("Houve um erro durante a busca do usuário!");
    }
}
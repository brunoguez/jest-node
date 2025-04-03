import sequelize from "../config/database.js";
import Usuario from "../models/Usuario.js";

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

export const countAll = async (req, res) => {
    try {
        const count = await Usuario.findAll();
        res.json({ count: count.length });
    } catch (error) {
        console.error("Erro ao contar usuários:", error);
        res.status(500).json({ error: "Erro ao contar usuários" });
    }
};

export const usuarioMaisPedidos = async (req, res) => {
    try {
        const [resultado] = await sequelize.query(`
            SELECT u.id_usuario, u.nome, COUNT(p.id_pedido) AS total_pedidos
            FROM Usuarios u
            LEFT JOIN Pedidos p ON u.id_usuario = p.fk_Usuario
            GROUP BY u.id_usuario
            ORDER BY total_pedidos DESC
            LIMIT 1
        `);
        if (!resultado.length) return res.status(404).json({ error: "Nenhum pedido encontrado" });

        res.json(resultado[0]);
    } catch (error) {
        console.error("Erro ao buscar usuário com mais pedidos:", error);
        res.status(500).json({ error: "Erro ao buscar usuário com mais pedidos" });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

        res.json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) return res.status(200).json(null);

        const { nome } = req.body;
        if (!nome || nome == usuario?.nome) return res.status(204).json(usuario);

        const usuarioUpdate = await usuario.update({ nome });

        res.status(200).json(usuarioUpdate);
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) return res.status(400).json({ error: "Nome e email são obrigatórios" });

        const usuario = await Usuario.create({ nome, email });

        res.status(201).json(usuario);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findByPk(id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        await user.destroy();
        res.sendStatus(200);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
};

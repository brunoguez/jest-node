import Pedido from "../models/Pedido.js";

export const getPedidos = async (req, res) => {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
};

export const getPedidosById = async (req, res) => {
    const { id: fk_Usuario } = req.params;
    const pedidos = await Pedido.findAll({
        where: { fk_Usuario },
    });
    if(!pedidos.length) return res.status(200).send(0);
    res.json(pedidos);
};

export const createPedido = async (req, res) => {
    const { descricao, valor, fk_Usuario } = req.body;
    const pedido = await Pedido.create({ descricao, valor, fk_Usuario });
    res.status(201).json(pedido);
};

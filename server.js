import express from "express";
import sequelize from "./config/database.js";
import {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    update,
    deleteUsuario,
    countAll,
    usuarioMaisPedidos,
    usuarioByValor
} from "./controllers/usuarioController.js";
import {
    getPedidos,
    createPedido,
    getPedidosById
} from "./controllers/pedidoController.js";

const app = express();
app.use(express.json());

app.get("/usuarios", getUsuarios);
app.get("/usuario/:id", getUsuarioById);
app.patch("/usuario/:id", update);
app.post("/usuario", createUsuario);
app.delete("/usuario/:id", deleteUsuario);
app.get("/usuarios/count", countAll);

app.get("/pedidos", getPedidos);
app.get("/pedidos/:id", getPedidosById);
app.post("/pedidos", createPedido);
app.get("/usuarios/maisPedidos", usuarioMaisPedidos);
app.get("/usuariosByValor", usuarioByValor);

if (process.env.NODE_ENV !== "test") {
    sequelize.sync().then(() => {
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    });
}

export default app;

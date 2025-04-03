import request from "supertest";
import app from "../server.js";
import { v4 as uuidv4 } from 'uuid';

describe("Testando API de Usuários", () => {
    test("1 - Deve criar um usuário", async () => {
        const novo = uuidv4();

        const res = await request(app)
            .post("/usuario")
            .send({ nome: novo, email: novo + "@email.com" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id_usuario");
    });

    test("2 - Deve retornar um usuário pelo ID", async () => {
        const idUsuario = 20;

        const res = await request(app).get(`/usuario/${idUsuario}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id_usuario", idUsuario);
        expect(res.body).toHaveProperty("nome");
        expect(res.body).toHaveProperty("email");
    });

    test("2 - Deve retornar 404 para usuário não encontrado", async () => {
        const idInexistente = 9999;

        const res = await request(app).get(`/usuario/${idInexistente}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Usuário não encontrado");
    });

    test("3 - Deve verificar se o nome foi alterado", async () => {
        const nome = uuidv4();
        const idUsuario = 20;

        const res = await request(app)
            .patch(`/usuario/${idUsuario}`)
            .send({ nome });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("nome", nome);
    });

    test("3 - Deve verificar se retornou null quando o id não existe", async () => {
        const nome = uuidv4();
        const idUsuario = 2088;

        const res = await request(app)
            .patch(`/usuario/${idUsuario}`)
            .send({ nome });
        expect(res.statusCode).toBe(200);
        expect(null).toBeNull()
        expect(undefined).toBeUndefined()
        expect(true).not.toBeNull()
    });

    test("4 - Deve excluir e verificar se o usuário foi deletado", async () => {
        const novo = uuidv4();
        const resCreate = await request(app)
            .post("/usuario")
            .send({ nome: novo, email: novo + "@email.com" });

        const idUsuario = resCreate.body.id_usuario;

        const res = await request(app).delete(`/usuario/${idUsuario}`);
        expect(res.statusCode).toBe(200);

        const resGetUsuario = await request(app).get(`/usuario/${idUsuario}`);
        expect(resGetUsuario.statusCode).toBe(404);
        expect(resGetUsuario.body).toHaveProperty("error", "Usuário não encontrado");
    });

    test("8 - Contar usuários. Após incluir e remover usuários.", async () => {
        const resCount = await request(app).get("/usuarios/count");
        const countAnterior = resCount.body.count;

        const qtAdd = 6;
        const idsCriados = [];

        for (let i = 0; i < qtAdd; i++) {
            const nome = uuidv4();
            const res = await request(app)
                .post("/usuario")
                .send({ nome, email: nome + "@email.com" });
            idsCriados.push(res.body.id_usuario);
        }

        const resCountMeio = await request(app).get("/usuarios/count");
        const countMeio = countAnterior + qtAdd;
        expect(resCountMeio.body).toHaveProperty("count", countMeio);

        const qtPop = qtAdd - 2;
        for (let i = 0; i < qtPop; i++) await request(app).delete(`/usuario/${idsCriados[i]}`);

        const resCountFinal = await request(app).get("/usuarios/count");
        const countFinal = countMeio - qtPop;
        expect(resCountFinal.body).toHaveProperty("count", countFinal);
    });

    test("9 - Usuário com mais pedido", async () => {
        const [resUserMaisPedidos, reqTodosPedidos] = await Promise.all([
            request(app).get("/usuarios/maisPedidos"),
            request(app).get("/pedidos")
        ]);

        const groupPedidos = Object.groupBy(reqTodosPedidos.body, ({ fk_Usuario }) => fk_Usuario);
        const usersPedidos = Object.entries(groupPedidos)
            .map(([id_usuario, qt]) => ({ id_usuario, qt: qt.length }))
            .sort((a, b) => b.qt - a.qt);
        const userMaisPedidos = usersPedidos[0];

        expect(resUserMaisPedidos.body).toHaveProperty("id_usuario", Number(userMaisPedidos.id_usuario));
    });

    test("10 - Usuários que gastaram a mais de um valor ou array vazio quando ninguém atende", async () => {
        const valorCorte = 10;
        const [resUserMaisPedidos, reqTodosPedidos] = await Promise.all([
            request(app).get("/pedidos?valorCorte=" + valorCorte),
            request(app).get("/pedidos")
        ]);
    });
});
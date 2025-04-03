import sequelize from "./config/database.js";
import Usuario from "./models/Usuario.js";
import Pedido from "./models/Pedido.js";

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const usuarios = [];
    for (let i = 1; i <= 20; i++) {
        const user = await Usuario.create({
            nome: `Usuário ${i}`,
            email: `usuario${i}@email.com`
        });
        usuarios.push(user);
    }

    for (let i = 1; i <= 20; i++) {
        await Pedido.create({
            descricao: `Pedido ${i}`,
            valor: (Math.random() * 100).toFixed(2),
            fk_Usuario: usuarios[i % 20].id_usuario
        });
    }

    console.log("Banco populado!");
    process.exit();
};

seedDatabase();

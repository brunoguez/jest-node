import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Pedido = sequelize.define("Pedido", {
    id_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descricao: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.FLOAT, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Pedido.belongsTo(Usuario, { foreignKey: "fk_Usuario" });
Usuario.hasMany(Pedido, { foreignKey: "fk_Usuario" });

export default Pedido;

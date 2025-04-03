import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./jestNode.sqlite",
  logging: false, // Para evitar logs no console
});

export default sequelize;

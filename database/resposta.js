const sequelize = require("sequelize");
const connection = require("./database");

const resposta = connection.define("resposta", {
  corpo: {
    type: sequelize.TEXT,
    allowNull: false,
  },
  perguntaid: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
});

resposta.sync({ force: false }).then(() => {});
module.exports = resposta;

const sequelize = require("sequelize");

const connection = new sequelize("guiaperguntas", "root", "lucas123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;

// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dbhk4x9gwus6mw", "u3m7grklvtlo6", "AekAds@24", {
  host: "35.209.89.182",
  dialect: "postgres",
});

module.exports = sequelize;

const { Sequelize, DataTypes } = require('sequelize');
// const moment = require('moment-timezone');
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {
    host: '35.209.89.182',
    dialect: 'postgres'
});


const Customer = sequelize.define('Customer', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  mobile_number: { type: DataTypes.STRING },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  invoices: { type: DataTypes.ARRAY(DataTypes.TEXT) },
}, {
  tableName: 'customers',
  timestamps: false,
});

module.exports = Customer;

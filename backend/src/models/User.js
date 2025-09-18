const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // A senha pode ser nula se o usuário se registrar via Google
  },
  role: {
    type: DataTypes.ENUM('recycler', 'collector'),
    allowNull: false,
    defaultValue: 'recycler',
  },
  googleId: {//Google OAuth
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  //Extras
});

module.exports = User;
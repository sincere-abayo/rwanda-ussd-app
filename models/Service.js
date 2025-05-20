const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_rw: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('healthcare', 'education', 'transportation'),
    allowNull: false
  },
  description_en: {
    type: DataTypes.TEXT
  },
  description_rw: {
    type: DataTypes.TEXT
  },
  contact: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  }
});

module.exports = Service;

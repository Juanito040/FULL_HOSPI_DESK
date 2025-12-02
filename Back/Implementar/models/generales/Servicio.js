const { DataTypes } = require('sequelize');
const sequelize = require('../../config/configDb');

const Servicio = sequelize.define('Servicio', {
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'Servicio',
    timestamps: true,
  });

  module.exports = Servicio;
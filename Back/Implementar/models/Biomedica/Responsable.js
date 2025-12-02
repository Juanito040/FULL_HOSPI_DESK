const { DataTypes } = require('sequelize');
const sequelize = require('../../config/configDb');

const Responsable = sequelize.define('Responsable', {
  
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    garantia: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    externo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Responsable',
    timestamps: true,
});

module.exports = Responsable;
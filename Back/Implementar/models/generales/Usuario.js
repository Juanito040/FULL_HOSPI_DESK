const { DataTypes } = require('sequelize');
const sequelize = require('../../config/configDb');
const Rol = require ('./Rol');

const Usuario = sequelize.define('Usuario', {
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tipoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numeroId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registroInvima: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  rolId: {
    type: DataTypes.INTEGER,
    references: {
      model: Rol,
      key: 'id'
    },
    allowNull: false,
  },
}, {
  tableName: 'Usuario',
  timestamps: true,
});

Usuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rolId', as: 'usuarios' });

module.exports = Usuario;

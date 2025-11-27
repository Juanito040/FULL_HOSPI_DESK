const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Responsable = sequelize.define('responsable', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    garantia: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    externo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'responsable',
    timestamps: true,
    underscored: false
  });

  Responsable.associate = (models) => {
    Responsable.hasMany(models.Equipo, {
      foreignKey: 'responsableIdFk',
      as: 'equipos'
    });
  };

  return Responsable;
};

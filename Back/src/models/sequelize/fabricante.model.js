const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fabricante = sequelize.define('fabricante', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pais: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
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
    tableName: 'fabricante',
    timestamps: true,
    underscored: false
  });

  Fabricante.associate = (models) => {
    Fabricante.hasMany(models.HojaVida, {
      foreignKey: 'fabricanteIdFk',
      as: 'hojasVida'
    });
  };

  return Fabricante;
};

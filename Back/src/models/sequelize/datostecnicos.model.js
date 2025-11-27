const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DatosTecnicos = sequelize.define('datostecnicos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vMaxOperacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    vMinOperacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    iMaxOperacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    iMinOperacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    wConsumida: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    frecuencia: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    presion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    velocidad: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    temperatura: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    peso: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    capacidad: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
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
    tableName: 'datostecnicos',
    timestamps: true,
    underscored: false
  });

  DatosTecnicos.associate = (models) => {
    DatosTecnicos.hasOne(models.HojaVida, {
      foreignKey: 'datosTecnicosIdFk',
      as: 'hojaVida'
    });
  };

  return DatosTecnicos;
};

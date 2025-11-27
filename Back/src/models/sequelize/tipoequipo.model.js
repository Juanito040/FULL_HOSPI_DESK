const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoEquipo = sequelize.define('tipoequipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    materialConsumible: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    herramienta: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tiempoMinutos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    repuestosMinimos: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipoR: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    actividad: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
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
    tableName: 'tipoequipo',
    timestamps: true,
    underscored: false
  });

  TipoEquipo.associate = (models) => {
    TipoEquipo.hasMany(models.Equipo, {
      foreignKey: 'tipoEquipoIdFk',
      as: 'equipos'
    });

    TipoEquipo.hasMany(models.SysEquipo, {
      foreignKey: 'id_tipo_equipo_fk',
      as: 'sysequipos'
    });
  };

  return TipoEquipo;
};

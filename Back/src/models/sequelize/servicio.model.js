const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Servicio = sequelize.define('servicio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ubicacion: {
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
    tableName: 'servicio',
    timestamps: true,
    underscored: false
  });

  Servicio.associate = (models) => {
    Servicio.hasMany(models.Equipo, {
      foreignKey: 'servicioIdFk',
      as: 'equipos'
    });

    Servicio.hasMany(models.SysEquipo, {
      foreignKey: 'id_servicio_fk',
      as: 'sysequipos'
    });
  };

  return Servicio;
};

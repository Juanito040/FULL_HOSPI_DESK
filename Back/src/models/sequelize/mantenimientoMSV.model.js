const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MantenimientoMSV = sequelize.define('mantenimiento_msv', {
    id_mantenimiento_msv: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alarmas: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sensores: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    cables: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    pantalla: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    bateria: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_equipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'equipo',
        key: 'id'
      }
    },
    id_mantenimiento_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mantenimiento_preventivo',
        key: 'id_mantenimiento_preventivo'
      }
    }
  }, {
    tableName: 'mantenimiento_msv',
    timestamps: false
  });

  MantenimientoMSV.associate = (models) => {
    MantenimientoMSV.belongsTo(models.Equipo, {
      foreignKey: 'id_equipo_fk',
      as: 'equipo'
    });

    MantenimientoMSV.belongsTo(models.MantenimientoPreventivo, {
      foreignKey: 'id_mantenimiento_fk',
      as: 'mantenimiento'
    });
  };

  return MantenimientoMSV;
};

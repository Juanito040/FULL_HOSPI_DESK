const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MantenimientoPreventivo = sequelize.define('mantenimiento_preventivo', {
    id_mantenimiento_preventivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_equipo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    serie: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    placa_inventario: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    servicio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_realizacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dias: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tiempo_realizacion: {
      type: DataTypes.TIME,
      allowNull: true
    },
    realizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    checkcode: {
      type: DataTypes.STRING(255),
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
    id_tipo_equipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoequipo',
        key: 'id'
      }
    },
    id_usuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    id_reporte_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reporte',
        key: 'id'
      }
    }
  }, {
    tableName: 'mantenimiento_preventivo',
    timestamps: true
  });

  MantenimientoPreventivo.associate = (models) => {
    MantenimientoPreventivo.belongsTo(models.Equipo, {
      foreignKey: 'id_equipo_fk',
      as: 'equipo'
    });
    MantenimientoPreventivo.belongsTo(models.TipoEquipo, {
      foreignKey: 'id_tipo_equipo_fk',
      as: 'tipoEquipo'
    });
    MantenimientoPreventivo.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario_fk',
      as: 'usuario'
    });
    if (models.Reporte) {
      MantenimientoPreventivo.belongsTo(models.Reporte, {
        foreignKey: 'id_reporte_fk',
        as: 'reporte'
      });
    }
  };

  return MantenimientoPreventivo;
};

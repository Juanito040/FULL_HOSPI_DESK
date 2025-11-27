const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IndEquipo = sequelize.define('indequipo', {
    id_indequipo: {
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
    codigo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ubicacion_especifica: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ano_ingreso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dias_mantenimiento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    periodicidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mtto: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    calibracion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    calificacion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    validacion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_hospital_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hospital',
        key: 'id_hospital'
      }
    },
    id_servicio_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
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
    id_responsable_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'responsable',
        key: 'id'
      }
    }
  }, {
    tableName: 'indequipo',
    timestamps: true
  });

  IndEquipo.associate = (models) => {
    IndEquipo.belongsTo(models.Hospital, {
      foreignKey: 'id_hospital_fk',
      as: 'hospital'
    });
    IndEquipo.belongsTo(models.Servicio, {
      foreignKey: 'id_servicio_fk',
      as: 'servicio'
    });
    IndEquipo.belongsTo(models.TipoEquipo, {
      foreignKey: 'id_tipo_equipo_fk',
      as: 'tipoEquipo'
    });
    IndEquipo.belongsTo(models.Responsable, {
      foreignKey: 'id_responsable_fk',
      as: 'responsable'
    });
    if (models.IndHojaVida) {
      IndEquipo.hasOne(models.IndHojaVida, {
        foreignKey: 'id_indequipo_fk',
        as: 'hojaVida'
      });
    }
  };

  return IndEquipo;
};

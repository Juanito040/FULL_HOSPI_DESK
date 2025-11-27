const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Equipo = sequelize.define('equipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    registroInvima: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    riesgo: {
      type: DataTypes.ENUM('NA', 'I', 'IIA', 'IIB', 'III'),
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ubicacionEspecifica: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    periodicidadM: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    periodicidadC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    estadoBaja: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    calibracion: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    calificacion: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    validacion: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    tipoEquipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipoequipo',
        key: 'id'
      }
    },
    servicioIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicio',
        key: 'id'
      }
    },
    sedeIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sede',
        key: 'id'
      }
    },
    responsableIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'responsable',
        key: 'id'
      }
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
    tableName: 'equipo',
    timestamps: true,
    underscored: false,
    indexes: [
      { fields: ['tipoEquipoIdFk'] },
      { fields: ['servicioIdFk'] },
      { fields: ['sedeIdFk'] },
      { fields: ['responsableIdFk'] }
    ]
  });

  Equipo.associate = (models) => {
    // Relaciones BelongsTo (un equipo pertenece a...)
    Equipo.belongsTo(models.TipoEquipo, {
      foreignKey: 'tipoEquipoIdFk',
      as: 'tipoEquipo'
    });

    Equipo.belongsTo(models.Servicio, {
      foreignKey: 'servicioIdFk',
      as: 'servicio'
    });

    Equipo.belongsTo(models.Sede, {
      foreignKey: 'sedeIdFk',
      as: 'sede'
    });

    Equipo.belongsTo(models.Responsable, {
      foreignKey: 'responsableIdFk',
      as: 'responsable'
    });

    // Relaciones HasMany (un equipo tiene muchos...)
    Equipo.hasMany(models.Documento, {
      foreignKey: 'equipoIdFk',
      as: 'documentos'
    });

    if (models.Reporte) {
      Equipo.hasMany(models.Reporte, {
        foreignKey: 'equipoIdFk',
        as: 'reportes'
      });
    }

    if (models.MantenimientoPreventivo) {
      Equipo.hasMany(models.MantenimientoPreventivo, {
        foreignKey: 'id_equipo_fk',
        as: 'mantenimientosPreventivos'
      });
    }

    if (models.Repuesto) {
      Equipo.hasMany(models.Repuesto, {
        foreignKey: 'id_equipo_fk',
        as: 'repuestos'
      });
    }

    // Relaciones HasOne (un equipo tiene una...)
    Equipo.hasOne(models.HojaVida, {
      foreignKey: 'equipoIdFk',
      as: 'hojaVida'
    });
  };

  return Equipo;
};

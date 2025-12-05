const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SysEquipo = sequelize.define('sysequipo', {
    id_sysequipo: {
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
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    serie: {
      type: DataTypes.STRING(80),
      allowNull: false
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
      allowNull: true
    },
    ano_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dias_mantenimiento: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    periodicidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado_baja: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    administrable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    direccionamiento_Vlan: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: ' '
    },
    numero_puertos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    mtto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preventivo_s: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fecha_modificacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ubicacion_anterior: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    id_usuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
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
    tableName: 'sysequipo',
    timestamps: true,
    underscored: false,
    indexes: [
      { fields: ['id_servicio_fk'] },
      { fields: ['activo'] }
    ]
  });

  SysEquipo.associate = (models) => {
    SysEquipo.belongsTo(models.Hospital, {
      foreignKey: 'id_hospital_fk',
      as: 'hospital'
    });

    SysEquipo.belongsTo(models.Servicio, {
      foreignKey: 'id_servicio_fk',
      as: 'servicio'
    });

    SysEquipo.belongsTo(models.TipoEquipo, {
      foreignKey: 'id_tipo_equipo_fk',
      as: 'tipoEquipo'
    });

    SysEquipo.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario_fk',
      as: 'usuario'
    });

    // Relación con SysHojaVida (Uno a Uno)
    if (models.SysHojaVida) {
      SysEquipo.hasOne(models.SysHojaVida, {
        foreignKey: 'id_sysequipo_fk',
        as: 'hojaVida'
      });
    }

    // Relación con SysMantenimiento (Uno a Muchos)
    if (models.SysMantenimiento) {
      SysEquipo.hasMany(models.SysMantenimiento, {
        foreignKey: 'id_sysequipo_fk',
        as: 'mantenimientos'
      });
    }

    // Relación con SysRepuesto (Uno a Muchos)
    if (models.SysRepuesto) {
      SysEquipo.hasMany(models.SysRepuesto, {
        foreignKey: 'id_sys_equipo_fk',
        as: 'repuestos'
      });
    }

    // Relación con SysBaja (Uno a Uno)
    if (models.SysBaja) {
      SysEquipo.hasOne(models.SysBaja, {
        foreignKey: 'id_sysequipo_fk',
        as: 'baja'
      });
    }
  };

  return SysEquipo;
};

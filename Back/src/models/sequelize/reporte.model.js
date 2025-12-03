const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reporte = sequelize.define('reporte', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    añoProgramado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mesProgramado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaRealizado: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: true
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    horaTerminacion: {
      type: DataTypes.TIME,
      allowNull: true
    },
    horaTotal: {
      type: DataTypes.TIME,
      allowNull: true
    },
    tipoMantenimiento: {
      type: DataTypes.ENUM('Correctivo', 'Preventivo', 'Predictivo', 'Otro'),
      allowNull: true
    },
    tipoFalla: {
      type: DataTypes.ENUM('Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra'),
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trabajoRealizado: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreRecibio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cedulaRecibio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mantenimientoPropio: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    realizado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    rutaPdf: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    servicioIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicio',
        key: 'id'
      }
    },
    equipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sysequipo',
        key: 'id_sysequipo'
      }
    },
    usuarioIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    tableName: 'reporte',
    timestamps: true
  });

  Reporte.associate = (models) => {
    Reporte.belongsTo(models.Servicio, {
      foreignKey: 'servicioIdFk',
      as: 'servicio'
    });
    Reporte.belongsTo(models.SysEquipo, {
      foreignKey: 'equipoIdFk',
      as: 'sysequipo'
    });
    Reporte.belongsTo(models.Usuario, {
      foreignKey: 'usuarioIdFk',
      as: 'usuario'
    });
  };

  return Reporte;
};

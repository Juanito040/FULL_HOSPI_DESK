const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Llamado = sequelize.define('llamado', {
    id_llamado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    atencion_prioridad: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    atendido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    confirmacion_telefono: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(255),
      defaultValue: 'Pendiente'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_r: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_sn: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hora_llamado: {
      type: DataTypes.TIME,
      allowNull: true
    },
    hora_respuesta: {
      type: DataTypes.TIME,
      allowNull: true
    },
    hora_solucion: {
      type: DataTypes.TIME,
      allowNull: true
    },
    palabras_clave: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    por_telefono: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    prioridad: {
      type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Urgente'),
      defaultValue: 'Media'
    },
    realizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    serie: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    solucion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ubicacion_exacta: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bitacora: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    solucionado_por: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    afecta_paciente: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    equipo_desabilitado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tiempo_parada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_serviciofk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
        key: 'id'
      }
    },
    tipo_equipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoequipo',
        key: 'id'
      }
    }
  }, {
    tableName: 'llamado',
    timestamps: true
  });

  Llamado.associate = (models) => {
    Llamado.belongsTo(models.Servicio, {
      foreignKey: 'id_serviciofk',
      as: 'servicio'
    });
    Llamado.belongsTo(models.TipoEquipo, {
      foreignKey: 'tipo_equipo',
      as: 'tipoEquipo'
    });
  };

  return Llamado;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SysMantenimiento = sequelize.define('sysmantenimiento', {
    id_sysmtto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_reporte: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hora_llamado: {
      type: DataTypes.TIME,
      allowNull: true
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: true
    },
    hora_terminacion: {
      type: DataTypes.TIME,
      allowNull: true
    },
    tipo_mantenimiento: {
      type: DataTypes.ENUM('Correctivo', 'Preventivo', 'Predictivo', 'Otro'),
      allowNull: true
    },
    tipo_falla: {
      type: DataTypes.ENUM('Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra'),
      allowNull: true
    },
    mphardware: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mantenimiento preventivo hardware'
    },
    mpsoftware: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mantenimiento preventivo software'
    },
    rutinah: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Rutinas de hardware'
    },
    rutinas: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Rutinas de software'
    },
    observacionesh: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones de hardware'
    },
    observacioness: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones de software'
    },
    autor_realizado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Técnico que realizó el mantenimiento'
    },
    autor_recibido: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Persona que recibió el equipo'
    },
    tiempo_fuera_servicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tiempo en minutos fuera de servicio'
    },
    dano: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del daño'
    },
    entega: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detalles de entrega'
    },
    rutahardware: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ruta del PDF de mantenimiento hardware'
    },
    rutasoftware: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ruta del PDF de mantenimiento software'
    },
    rutaentrega: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ruta del PDF de entrega'
    },
    id_sysequipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sysequipo',
        key: 'id_sysequipo'
      }
    },
    id_sysusuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    tableName: 'sysmantenimiento',
    timestamps: true
  });

  SysMantenimiento.associate = (models) => {
    // Relación con SysEquipo
    SysMantenimiento.belongsTo(models.SysEquipo, {
      foreignKey: 'id_sysequipo_fk',
      as: 'equipo'
    });

    // Relación con Usuario (técnico que realizó)
    SysMantenimiento.belongsTo(models.Usuario, {
      foreignKey: 'id_sysusuario_fk',
      as: 'usuario'
    });
  };

  return SysMantenimiento;
};

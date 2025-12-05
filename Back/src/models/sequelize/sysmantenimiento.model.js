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
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '1=Correctivo, 2=Preventivo, 3=Predictivo, 4=Otro'
    },
    tipo_falla: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '1=Desgaste, 2=Operación Indebida, 3=Causa Externa, 4=Accesorios, 5=Desconocido, 6=Sin Falla, 7=Otros, 8=No Registra'
    },
    mphardware: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Mantenimiento preventivo hardware realizado'
    },
    mpsoftware: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Mantenimiento preventivo software realizado'
    },
    rutinah: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Rutinas de hardware'
    },
    rutinas: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Indica si hay daño'
    },
    entega: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Indica si se realizó entrega'
    },
    rutahardware: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ruta del PDF de mantenimiento hardware'
    },
    rutasoftware: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ruta del PDF de mantenimiento software'
    },
    rutaentrega: {
      type: DataTypes.TEXT,
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

// Modelo de Hoja de Vida para equipos de sistemas
module.exports = (sequelize, DataTypes) => {
  const SysHojaVida = sequelize.define('SysHojaVida', {
    id_syshoja_vida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_syshoja_vida'
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mac: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    procesador: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ram: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    disco_duro: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sistema_operativo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    office: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tonner: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vendedor: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: ''
    },
    tipo_uso: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    fecha_compra: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_instalacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_iniciooperacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_vencimientogarantia: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_update: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    costo_compra: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contrato: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailinstitucion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    municipio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nivelinstitucion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefonoinstitucion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // Tipo de adquisición
    compraddirecta: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    convenio: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    donado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    comodato: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    asignadoporgobernacion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    asignadoporministerio: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    id_sysequipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sysequipo',
        key: 'id_sysequipo'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'syshoja_vida',
    timestamps: true,
    indexes: [
      {
        name: 'idx_syshoja_vida_equipo',
        fields: ['id_sysequipo_fk']
      },
      {
        name: 'idx_syshoja_vida_ip',
        fields: ['ip']
      },
      {
        name: 'idx_syshoja_vida_mac',
        fields: ['mac']
      }
    ]
  });

  SysHojaVida.associate = (models) => {
    if (models.SysEquipo) {
      SysHojaVida.belongsTo(models.SysEquipo, {
        foreignKey: 'id_sysequipo_fk',
        as: 'equipo',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  };

  return SysHojaVida;
};

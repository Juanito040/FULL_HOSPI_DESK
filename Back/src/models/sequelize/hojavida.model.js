const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HojaVida = sequelize.define('hojavida', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigoInternacional: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    anoIngreso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contrato: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipoAdquisicion: {
      type: DataTypes.ENUM('Compra', 'Convenio', 'Donación', 'Comodato', 'Alquiler', 'NR'),
      allowNull: true
    },
    fechaCompra: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaInstalacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaIncorporacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaVencimientoGarantia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    costoCompra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fuente: {
      type: DataTypes.ENUM('Electricidad', 'Energia Solar', 'Agua', 'Gas', 'Vapor de agua', 'Derivados del petroleo', 'Otra'),
      allowNull: true
    },
    tipoUso: {
      type: DataTypes.ENUM('Diagnostico', 'Terapéutico', 'Soporte Vital', 'Quirúrgico', 'Equipo de laboratorio', 'Rehabilitación', 'Gestión y Soporte Hospitalario', 'NR'),
      allowNull: true
    },
    clase: {
      type: DataTypes.ENUM('Electrico', 'Electronico', 'Mecanico', 'Electromecanico', 'Hidraulico', 'Neumatico', 'Vapor', 'Solar', 'Otro'),
      allowNull: true
    },
    mantenimiento: {
      type: DataTypes.ENUM('Propio', 'Contratado', 'Comodato', 'Garantia'),
      allowNull: true
    },
    propiedad: {
      type: DataTypes.ENUM('Hospital', 'Proveedor', 'otro'),
      allowNull: true
    },
    equipoPortatil: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    datosTecnicosIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'datostecnicos',
        key: 'id'
      }
    },
    equipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'equipo',
        key: 'id'
      }
    },
    fabricanteIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fabricante',
        key: 'id'
      }
    },
    proveedorIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
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
    tableName: 'hojavida',
    timestamps: true,
    underscored: false,
    indexes: [
      { fields: ['datosTecnicosIdFk'] },
      { fields: ['equipoIdFk'] },
      { fields: ['fabricanteIdFk'] },
      { fields: ['proveedorIdFk'] }
    ]
  });

  HojaVida.associate = (models) => {
    HojaVida.belongsTo(models.DatosTecnicos, {
      foreignKey: 'datosTecnicosIdFk',
      as: 'datosTecnicos'
    });

    HojaVida.belongsTo(models.Equipo, {
      foreignKey: 'equipoIdFk',
      as: 'equipo'
    });

    HojaVida.belongsTo(models.Fabricante, {
      foreignKey: 'fabricanteIdFk',
      as: 'fabricante'
    });

    HojaVida.belongsTo(models.Proveedor, {
      foreignKey: 'proveedorIdFk',
      as: 'proveedor'
    });
  };

  return HojaVida;
};

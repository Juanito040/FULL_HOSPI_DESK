const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Repuesto = sequelize.define('repuesto', {
    id_repuesto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_repuesto: {
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
    cantidad: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    grupo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    iva: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    }
  }, {
    tableName: 'repuesto',
    timestamps: true
  });

  Repuesto.associate = (models) => {
    Repuesto.belongsTo(models.Equipo, {
      foreignKey: 'id_equipo_fk',
      as: 'equipo'
    });
    Repuesto.belongsTo(models.TipoEquipo, {
      foreignKey: 'id_tipo_equipo_fk',
      as: 'tipoEquipo'
    });
  };

  return Repuesto;
};

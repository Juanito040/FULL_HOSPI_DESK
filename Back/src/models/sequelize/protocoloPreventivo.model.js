const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProtocoloPreventivo = sequelize.define('protocolo_preventivo', {
    id_protocolo_preventivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    actividad: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cumple: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_mantenimiento_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mantenimiento_preventivo',
        key: 'id_mantenimiento_preventivo'
      }
    }
  }, {
    tableName: 'protocolo_preventivo',
    timestamps: false
  });

  ProtocoloPreventivo.associate = (models) => {
    ProtocoloPreventivo.belongsTo(models.MantenimientoPreventivo, {
      foreignKey: 'id_mantenimiento_fk',
      as: 'mantenimiento'
    });
  };

  return ProtocoloPreventivo;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CumplimientoProtocoloPreventivo = sequelize.define('cumplimientoProtocoloPreventivo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cumple: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    protocoloPreventivoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'protocoloPreventivo',
        key: 'id_protocolo_preventivo'
      }
    },
    reporteIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reporte',
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
    tableName: 'cumplimientoProtocoloPreventivo',
    timestamps: true,
    underscored: false
  });

  CumplimientoProtocoloPreventivo.associate = (models) => {
    CumplimientoProtocoloPreventivo.belongsTo(models.ProtocoloPreventivo, {
      foreignKey: 'protocoloPreventivoIdFk',
      as: 'protocolo'
    });

    CumplimientoProtocoloPreventivo.belongsTo(models.Reporte, {
      foreignKey: 'reporteIdFk',
      as: 'reporte'
    });
  };

  return CumplimientoProtocoloPreventivo;
};

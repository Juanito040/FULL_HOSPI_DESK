const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoDocumento = sequelize.define('tipodocumento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'tipodocumento',
    timestamps: true,
    underscored: false
  });

  TipoDocumento.associate = (models) => {
    TipoDocumento.hasMany(models.Documento, {
      foreignKey: 'tipoDocumntoIdFk',
      as: 'documentos'
    });
  };

  return TipoDocumento;
};

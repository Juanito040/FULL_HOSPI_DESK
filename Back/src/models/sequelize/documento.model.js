const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Documento = sequelize.define('documento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ruta: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    equipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipo',
        key: 'id'
      }
    },
    tipoDocumntoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipodocumento',
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
    tableName: 'documento',
    timestamps: true,
    underscored: false,
    indexes: [
      { fields: ['equipoIdFk'] },
      { fields: ['tipoDocumntoIdFk'] }
    ]
  });

  Documento.associate = (models) => {
    Documento.belongsTo(models.Equipo, {
      foreignKey: 'equipoIdFk',
      as: 'equipo',
      onDelete: 'CASCADE'
    });

    Documento.belongsTo(models.TipoDocumento, {
      foreignKey: 'tipoDocumntoIdFk',
      as: 'tipoDocumento',
      onDelete: 'CASCADE'
    });
  };

  return Documento;
};

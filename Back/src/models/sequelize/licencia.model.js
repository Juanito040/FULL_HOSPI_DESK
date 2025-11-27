const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Licencia = sequelize.define('licencia', {
    id_licencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resolucion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rutaformato: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_hospital_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hospital',
        key: 'id_hospital'
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
    tableName: 'licencia',
    timestamps: true,
    underscored: false
  });

  Licencia.associate = (models) => {
    Licencia.belongsTo(models.Hospital, {
      foreignKey: 'id_hospital_fk',
      as: 'hospital'
    });
  };

  return Licencia;
};

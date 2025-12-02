const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlanActividadMetrologica = sequelize.define('planActividadMetrologica', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    equipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipo',
        key: 'id'
      }
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipoActividad: {
      type: DataTypes.ENUM('Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica'),
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
    tableName: 'planActividadMetrologica',
    timestamps: true,
    underscored: false
  });

  PlanActividadMetrologica.associate = (models) => {
    PlanActividadMetrologica.belongsTo(models.Equipo, {
      foreignKey: 'equipoIdFk',
      as: 'equipo'
    });
  };

  return PlanActividadMetrologica;
};

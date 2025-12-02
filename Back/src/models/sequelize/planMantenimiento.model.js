const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlanMantenimiento = sequelize.define('planMantenimiento', {
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
    rangoInicio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rangoFin: {
      type: DataTypes.INTEGER,
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
    tableName: 'planMantenimiento',
    timestamps: true,
    underscored: false
  });

  PlanMantenimiento.associate = (models) => {
    PlanMantenimiento.belongsTo(models.Equipo, {
      foreignKey: 'equipoIdFk',
      as: 'equipo'
    });
  };

  return PlanMantenimiento;
};

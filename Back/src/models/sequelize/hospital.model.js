const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hospital = sequelize.define('hospital', {
    id_hospital: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_hospital: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    direccion_hospital: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nit_hospital: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    departamento: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
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
    tableName: 'hospital',
    timestamps: true,
    underscored: false
  });

  Hospital.associate = (models) => {
    Hospital.hasMany(models.Licencia, {
      foreignKey: 'id_hospital_fk',
      as: 'licencias'
    });

    Hospital.hasMany(models.SysEquipo, {
      foreignKey: 'id_hospital_fk',
      as: 'sysequipos'
    });
  };

  return Hospital;
};

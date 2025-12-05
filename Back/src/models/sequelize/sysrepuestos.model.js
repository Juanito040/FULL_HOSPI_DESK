const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SysRepuesto = sequelize.define('sysrepuesto', {
    id_sysrepuesto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_equipo: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    id_sys_equipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sysequipo',
        key: 'id_sysequipo'
      }
    }
  }, {
    tableName: 'sysrepuestos',
    timestamps: true
  });

  SysRepuesto.associate = (models) => {
    // Relación con SysEquipo
    SysRepuesto.belongsTo(models.SysEquipo, {
      foreignKey: 'id_sys_equipo_fk',
      as: 'equipo'
    });
  };

  return SysRepuesto;
};

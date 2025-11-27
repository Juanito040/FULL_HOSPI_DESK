const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SysBaja = sequelize.define('sysbaja', {
    id_sysbaja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_baja: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    justificacion_baja: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Justificación del por qué se da de baja el equipo'
    },
    accesorios_reutilizables: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lista de accesorios que pueden reutilizarse'
    },
    id_sysequipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sysequipo',
        key: 'id_sysequipo'
      }
    },
    id_sysusuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    tableName: 'sysbaja',
    timestamps: true
  });

  SysBaja.associate = (models) => {
    // Relación con SysEquipo
    SysBaja.belongsTo(models.SysEquipo, {
      foreignKey: 'id_sysequipo_fk',
      as: 'equipo'
    });

    // Relación con Usuario (quien dio de baja)
    SysBaja.belongsTo(models.Usuario, {
      foreignKey: 'id_sysusuario_fk',
      as: 'usuario'
    });
  };

  return SysBaja;
};

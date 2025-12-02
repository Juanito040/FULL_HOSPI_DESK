const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ActividadMetrologica = sequelize.define('actividadMetrologica', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipoActividad: {
      type: DataTypes.ENUM('Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica'),
      allowNull: false
    },
    mesProgramado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    añoProgramado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaRealizado: {
      type: DataTypes.DATE,
      allowNull: true
    },
    empresa: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    errorMaximoIdentificado: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resultado: {
      type: DataTypes.ENUM('Cumple', 'No Cumple', 'No Aplica'),
      allowNull: true
    },
    realizado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    rutaReporte: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    usuarioIdFk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    equipoIdFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipo',
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
    tableName: 'actividadMetrologica',
    timestamps: true,
    underscored: false
  });

  ActividadMetrologica.associate = (models) => {
    ActividadMetrologica.belongsTo(models.Equipo, {
      foreignKey: 'equipoIdFk',
      as: 'equipo'
    });

    ActividadMetrologica.belongsTo(models.Usuario, {
      foreignKey: 'usuarioIdFk',
      as: 'usuarioAprobo'
    });
  };

  return ActividadMetrologica;
};

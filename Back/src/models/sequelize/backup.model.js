const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Backup = sequelize.define('backup', {
    id_reporte_backup: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_recurso: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo_recurso: {
      type: DataTypes.ENUM(
        'Servidor virtual',
        'Servidor fisico',
        'Base de datos',
        'Computador',
        'Correo',
        'Switch',
        'TRD',
        'Otro'
      ),
      allowNull: false
    },
    destino: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    medio: {
      type: DataTypes.ENUM('Cinta', 'Disco', 'Servidor'),
      allowNull: false
    },
    periodicidad: {
      type: DataTypes.ENUM('Diario', 'Semanal', 'Mensual'),
      allowNull: false
    },
    fecha_backup: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tamano: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    autor_solicita: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    numero_caso_ms: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    caso_ms: {
      type: DataTypes.ENUM('Si', 'No'),
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_autor_realizado_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
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
    tableName: 'reporte_backup',
    timestamps: true,
    underscored: false
  });

  Backup.associate = (models) => {
    Backup.belongsTo(models.Usuario, {
      foreignKey: 'id_autor_realizado_fk',
      as: 'autorRealizado'
    });
  };

  return Backup;
};

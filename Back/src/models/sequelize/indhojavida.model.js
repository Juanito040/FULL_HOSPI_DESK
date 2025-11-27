const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IndHojaVida = sequelize.define('indhoja_vida', {
    id_indhoja_vida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fabricante: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    distribuidor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capacidad: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    peso: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    presion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    temperatura: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    frecuencia: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vmaxoperacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vminoperacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_instalacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    costo_compra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    manual_operacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    manual_tecnico: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clasificacionapoyo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clasificacionautoclaves: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clasificacionbombas: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clasificacionlavanderia: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clasificacionplantas: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_indequipo_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'indequipo',
        key: 'id_indequipo'
      }
    }
  }, {
    tableName: 'indhoja_vida',
    timestamps: true
  });

  IndHojaVida.associate = (models) => {
    IndHojaVida.belongsTo(models.IndEquipo, {
      foreignKey: 'id_indequipo_fk',
      as: 'indEquipo'
    });
  };

  return IndHojaVida;
};

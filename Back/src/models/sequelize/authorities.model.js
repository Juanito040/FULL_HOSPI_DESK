const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Authorities = sequelize.define('authorities', {
    id_authority: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    authority: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_usuario: {
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
    tableName: 'authorities',
    timestamps: true,
    underscored: false
  });

  Authorities.associate = (models) => {
    Authorities.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    Authorities.hasMany(models.UserAuthority, {
      foreignKey: 'authority_id',
      as: 'userAuthorities'
    });
  };

  return Authorities;
};

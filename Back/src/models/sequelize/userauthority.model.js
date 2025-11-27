const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserAuthority = sequelize.define('user_authority', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    authority_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'authorities',
        key: 'id_authority'
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
    tableName: 'user_authority',
    timestamps: true,
    underscored: false,
    indexes: [
      {
        unique: true,
        fields: ['id_usuario_fk', 'authority_id']
      }
    ]
  });

  UserAuthority.associate = (models) => {
    UserAuthority.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario_fk',
      as: 'usuario'
    });

    UserAuthority.belongsTo(models.Authorities, {
      foreignKey: 'authority_id',
      as: 'authority'
    });
  };

  return UserAuthority;
};

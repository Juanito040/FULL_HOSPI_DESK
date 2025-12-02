const { DataTypes } = require('sequelize');
const sequelize = require('../../config/configDb');
const Usuario = require('./../generales/Usuario');


const Backup = sequelize.define('Backup', {
    
    id_reporte_backup: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_recurso: {
        type: DataTypes.STRING,
        allowNull: false,
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
        type: DataTypes.STRING,
        allowNull: true
    },
    medio: {
        type: DataTypes.ENUM('Cinta', 'Disco', 'Servidor'),
        allowNull: false,
    },
    periodicidad: {
        type: DataTypes.ENUM('Diario', 'Semanal', 'Mensual'),
        allowNull: false,
    },
    fecha_backup: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tamano: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    autor_solicita: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numero_caso_ms: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    caso_ms: {
        type: DataTypes.ENUM('Si', 'No'),
        allowNull: false,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_autor_realizado_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
}, {
    tableName: 'reporte_backup',
    timestamps: true,
});

Backup.belongsTo(Usuario, {
    foreignKey: 'id_autor_realizado_fk',
    as: 'autorRealizado'
});

Usuario.hasMany(Backup, {
    foreignKey: 'id_autor_realizado_fk',
    as: 'back'
});

module.exports = Backup;
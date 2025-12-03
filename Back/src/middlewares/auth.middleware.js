const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models/sequelize');

/**
 * Middleware para autenticar usuarios mediante JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Obtener usuario de la base de datos
    const user = await db.Usuario.findByPk(decoded.id, {
      attributes: ['id', 'nombres', 'apellidos', 'nombreUsuario', 'email', 'estado', 'rolId'],
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.estado !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al autenticar usuario',
      error: error.message
    });
  }
};

/**
 * Middleware opcional que no falla si no hay token
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await db.Usuario.findByPk(decoded.id, {
      attributes: ['id', 'nombres', 'apellidos', 'nombreUsuario', 'email', 'estado', 'rolId'],
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (user && user.estado === 1) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate
};

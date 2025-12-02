const express = require('express');
const router = express.Router();
const db = require('../models/sequelize');

/**
 * Obtener todos los usuarios
 */
router.get('/', async (req, res) => {
  try {
    const { estado } = req.query;

    let whereClause = {};
    if (estado !== undefined) {
      whereClause.estado = parseInt(estado);
    }

    const usuarios = await db.Usuario.findAll({
      where: whereClause,
      attributes: ['id', 'nombres', 'apellidos', 'nombreUsuario', 'email', 'estado'],
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['nombres', 'ASC']]
    });

    res.json({
      success: true,
      data: usuarios,
      message: 'Usuarios obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

/**
 * Obtener un usuario por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await db.Usuario.findByPk(id, {
      attributes: ['id', 'nombres', 'apellidos', 'nombreUsuario', 'email', 'estado'],
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario,
      message: 'Usuario obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

module.exports = router;

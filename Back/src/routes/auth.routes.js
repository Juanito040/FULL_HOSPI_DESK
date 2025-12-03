const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('nombres').trim().notEmpty().withMessage('Nombres son requeridos'),
  body('apellidos').trim().notEmpty().withMessage('Apellidos son requeridos'),
  body('nombreUsuario').trim().notEmpty().withMessage('Nombre de usuario es requerido'),
  body('tipoId').trim().notEmpty().withMessage('Tipo de identificación es requerido'),
  body('numeroId').trim().notEmpty().withMessage('Número de identificación es requerido'),
  body('telefono').trim().notEmpty().withMessage('Teléfono es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('registroInvima').trim().notEmpty().withMessage('Registro INVIMA es requerido'),
  body('rolId').isInt().withMessage('Rol es requerido')
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('nombreUsuario').trim().notEmpty().withMessage('Nombre de usuario o email es requerido'),
  body('contraseña').notEmpty().withMessage('Contraseña es requerida')
];

/**
 * Ruta: POST /api/auth/register
 * Descripción: Registrar nuevo usuario
 */
router.post('/register', registerValidation, authController.register);

/**
 * Ruta: POST /api/auth/login
 * Descripción: Iniciar sesión
 */
router.post('/login', loginValidation, authController.login);

/**
 * Ruta: GET /api/auth/verify
 * Descripción: Verificar token JWT
 */
router.get('/verify', authController.verifyToken);

/**
 * Ruta: POST /api/auth/logout
 * Descripción: Cerrar sesión
 */
router.post('/logout', authenticate, authController.logout);

/**
 * Ruta: GET /api/auth/profile
 * Descripción: Obtener perfil del usuario autenticado
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * Ruta: POST /api/auth/change-password
 * Descripción: Cambiar contraseña
 */
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;

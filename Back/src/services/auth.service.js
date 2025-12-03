const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models/sequelize');

class AuthService {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado (sin contraseña)
   */
  async register(userData) {
    try {
      const {
        nombres,
        apellidos,
        nombreUsuario,
        tipoId,
        numeroId,
        telefono,
        email,
        contraseña,
        registroInvima,
        rolId
      } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await db.Usuario.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { nombreUsuario },
            { email }
          ]
        }
      });

      if (existingUser) {
        throw new Error('El nombre de usuario o email ya está registrado');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Crear el usuario
      const newUser = await db.Usuario.create({
        nombres,
        apellidos,
        nombreUsuario,
        tipoId,
        numeroId,
        telefono,
        email,
        contraseña: hashedPassword,
        registroInvima,
        rolId,
        estado: 1
      });

      // Obtener el usuario con su rol
      const userWithRole = await db.Usuario.findByPk(newUser.id, {
        attributes: ['id', 'nombres', 'apellidos', 'nombreUsuario', 'email', 'estado', 'rolId'],
        include: [
          {
            model: db.Rol,
            as: 'rol',
            attributes: ['id', 'nombre']
          }
        ]
      });

      return userWithRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Iniciar sesión de usuario
   * @param {string} nombreUsuario - Nombre de usuario o email
   * @param {string} contraseña - Contraseña del usuario
   * @returns {Promise<Object>} Usuario y token JWT
   */
  async login(nombreUsuario, contraseña) {
    try {
      // Buscar usuario por nombre de usuario o email
      const user = await db.Usuario.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { nombreUsuario },
            { email: nombreUsuario }
          ]
        },
        include: [
          {
            model: db.Rol,
            as: 'rol',
            attributes: ['id', 'nombre']
          }
        ]
      });

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (user.estado !== 1) {
        throw new Error('Usuario inactivo. Contacte al administrador');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          nombreUsuario: user.nombreUsuario,
          email: user.email,
          rolId: user.rolId
        },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      // Retornar usuario (sin contraseña) y token
      const userData = {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        nombreUsuario: user.nombreUsuario,
        email: user.email,
        estado: user.estado,
        rolId: user.rolId,
        rol: user.rol
      };

      return {
        user: userData,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Datos del usuario
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      // Obtener datos actualizados del usuario
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

      if (!user || user.estado !== 1) {
        throw new Error('Usuario no válido o inactivo');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   * @param {number} userId - ID del usuario
   * @param {string} contraseñaActual - Contraseña actual
   * @param {string} contraseñaNueva - Nueva contraseña
   * @returns {Promise<boolean>} Resultado de la operación
   */
  async changePassword(userId, contraseñaActual, contraseñaNueva) {
    try {
      const user = await db.Usuario.findByPk(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isPasswordValid = await bcrypt.compare(contraseñaActual, user.contraseña);
      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(contraseñaNueva, 10);

      // Actualizar contraseña
      await user.update({ contraseña: hashedPassword });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();

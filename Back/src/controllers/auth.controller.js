const authService = require('../services/auth.service');

/**
 * Controlador de Autenticación
 */
class AuthController {
  /**
   * Registrar nuevo usuario
   */
  async register(req, res) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: user
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar usuario',
        error: error.message
      });
    }
  }

  /**
   * Iniciar sesión
   */
  async login(req, res) {
    try {
      const { nombreUsuario, contraseña } = req.body;

      if (!nombreUsuario || !contraseña) {
        return res.status(400).json({
          success: false,
          message: 'Nombre de usuario y contraseña son requeridos'
        });
      }

      const result = await authService.login(nombreUsuario, contraseña);

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      console.error('Error en login:', error);

      // Determinar el código de estado apropiado según el error
      let statusCode = 401;
      let message = error.message || 'Error al iniciar sesión';

      // Usuario inactivo o cuenta deshabilitada
      if (message.includes('inactivo') || message.includes('deshabilitada')) {
        statusCode = 403;
        message = 'Tu cuenta está deshabilitada. Por favor, contacta al administrador.';
      }
      // Credenciales incorrectas
      else if (message.includes('Credenciales inválidas') || message.includes('contraseña')) {
        statusCode = 401;
        message = 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.';
      }
      // Usuario no encontrado
      else if (message.includes('no encontrado')) {
        statusCode = 404;
        message = 'Usuario no encontrado. Por favor, verifica tu nombre de usuario.';
      }

      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  }

  /**
   * Verificar token
   */
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const user = await authService.verifyToken(token);

      res.json({
        success: true,
        message: 'Token válido',
        data: user
      });
    } catch (error) {
      console.error('Error al verificar token:', error);
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
        error: error.message
      });
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(req, res) {
    try {
      res.json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: req.user
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener perfil',
        error: error.message
      });
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(req, res) {
    try {
      const { contraseñaActual, contraseñaNueva } = req.body;
      const userId = req.user.id;

      if (!contraseñaActual || !contraseñaNueva) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      if (contraseñaNueva.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      await authService.changePassword(userId, contraseñaActual, contraseñaNueva);

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al cambiar contraseña',
        error: error.message
      });
    }
  }

  /**
   * Cerrar sesión (opcional, para invalidar token si usas blacklist)
   */
  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();

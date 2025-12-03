/**
 * Middleware para autorizar usuarios según sus roles
 * Debe usarse después del middleware de autenticación
 */

/**
 * Verifica si el usuario tiene uno de los roles permitidos
 * @param {Array<string>|string} allowedRoles - Rol o roles permitidos
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const userRole = req.user.rol?.nombre;

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Usuario sin rol asignado'
        });
      }

      // Si allowedRoles está vacío, permitir cualquier rol autenticado
      if (allowedRoles.length === 0) {
        return next();
      }

      // Verificar si el rol del usuario está en la lista de roles permitidos
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este recurso',
          requiredRoles: allowedRoles,
          userRole: userRole
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorización:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
        error: error.message
      });
    }
  };
};

/**
 * Verifica si el usuario es administrador
 */
const isAdmin = authorize('Administrador');

/**
 * Verifica si el usuario es administrador o supervisor
 */
const isAdminOrSupervisor = authorize('Administrador', 'Supervisor');

module.exports = {
  authorize,
  isAdmin,
  isAdminOrSupervisor
};

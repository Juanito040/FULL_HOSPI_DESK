const { body } = require('express-validator');

/**
 * Validador para equipos de sistemas
 * 
 */
const sysEquipoValidator = [
    // 1. Serie (texto)
    body('serie')
        .optional()
        .isLength({ max: 255 }).withMessage('La serie no debe exceder 255 caracteres')
        .trim(),

    // 2. Nombre del equipo (texto) - REQUERIDO
    body('nombre_equipo')
        .notEmpty().withMessage('El nombre del equipo es requerido')
        .isLength({ max: 255 }).withMessage('El nombre no debe exceder 255 caracteres')
        .trim(),

    // 3. Marca (texto)
    body('marca')
        .optional()
        .isLength({ max: 255 }).withMessage('La marca no debe exceder 255 caracteres')
        .trim(),

    // 4. Modelo (texto)
    body('modelo')
        .optional()
        .isLength({ max: 255 }).withMessage('El modelo no debe exceder 255 caracteres')
        .trim(),

    // 5. Año de ingreso (fecha/año)
    body('ano_ingreso')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1900, max: 2100 }).withMessage('El año de ingreso debe ser válido (1900-2100)')
        .toInt(),

    // 6. Placa inventario (número/texto)
    body('placa_inventario')
        .optional()
        .isLength({ max: 255 }).withMessage('La placa de inventario no debe exceder 255 caracteres')
        .trim(),

    // 7. Servicio (lista desplegable - FK)
    body('id_servicio_fk')
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage('El ID del servicio debe ser un número entero')
        .toInt(),

    // 8. Ubicación (lista desplegable)
    body('ubicacion')
        .optional()
        .isLength({ max: 255 }).withMessage('La ubicación no debe exceder 255 caracteres')
        .trim(),

    // 9. Ubicación específica (texto)
    body('ubicacion_especifica')
        .optional()
        .isLength({ max: 255 }).withMessage('La ubicación específica no debe exceder 255 caracteres')
        .trim(),

    // 10. Código del equipo (número/texto)
    body('codigo')
        .optional()
        .isLength({ max: 255 }).withMessage('El código no debe exceder 255 caracteres')
        .trim(),

    // 11. Estado del equipo (0 = inactivo, 1 = activo)
    body('activo')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('El estado del equipo debe ser 0 (inactivo) o 1 (activo)')
        .toInt(),

    // 12. Tipo de equipo (FK)
    body('id_tipo_equipo_fk')
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage('El ID del tipo de equipo debe ser un número entero')
        .toInt(),

    // Periodicidad de mantenimiento
    body('periodicidad')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('La periodicidad debe ser un número entero positivo')
        .toInt(),

    // Hospital
    body('id_hospital_fk')
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage('El ID del hospital debe ser un número entero')
        .toInt(),

    // Usuario
    body('id_usuario_fk')
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage('El ID del usuario debe ser un número entero')
        .toInt(),

    // Otros campos opcionales
    body('estado_baja')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('El estado de baja debe ser 0 o 1')
        .toInt(),

    body('administrable')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('El campo administrable debe ser 0 o 1')
        .toInt(),

    body('direccionamiento_Vlan')
        .optional()
        .isLength({ max: 255 }).withMessage('El direccionamiento VLAN no debe exceder 255 caracteres')
        .trim(),

    body('numero_puertos')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('El número de puertos debe ser un entero positivo')
        .toInt(),

    body('mtto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage('El campo mtto debe ser un número entero')
        .toInt(),

    body('dias_mantenimiento')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('Los días de mantenimiento deben ser un entero positivo')
        .toInt()
];

module.exports = {
    sysEquipoValidator
};

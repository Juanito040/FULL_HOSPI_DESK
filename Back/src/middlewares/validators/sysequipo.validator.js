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
        .custom((value) => {
            // Permitir null, undefined o vacío
            if (value === null || value === undefined || value === '') {
                return true;
            }
            // Si tiene valor, verificar que sea un año válido
            const year = parseInt(value);
            if (isNaN(year) || year < 1900 || year > 2100) {
                throw new Error('El año de ingreso debe ser válido (1900-2100)');
            }
            return true;
        }),

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
        .optional({ nullable: true })
        .custom((value) => {
            // Permitir null, undefined, vacío, boolean o números 0/1
            if (value === null || value === undefined || value === '') {
                return true;
            }
            // Convertir booleanos a números
            if (typeof value === 'boolean') {
                return true;
            }
            // Verificar si es 0, 1, "0", "1", true o false
            const validValues = [0, 1, '0', '1', true, false];
            if (validValues.includes(value)) {
                return true;
            }
            throw new Error('El estado del equipo debe ser 0 (inactivo) o 1 (activo)');
        }),

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
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null || value === undefined || value === '') return true;
            if (typeof value === 'boolean') return true;
            const validValues = [0, 1, '0', '1', true, false];
            if (validValues.includes(value)) return true;
            throw new Error('El estado de baja debe ser 0 o 1');
        }),

    body('administrable')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null || value === undefined || value === '') return true;
            if (typeof value === 'boolean') return true;
            const validValues = [0, 1, '0', '1', true, false];
            if (validValues.includes(value)) return true;
            throw new Error('El campo administrable debe ser 0 o 1');
        }),

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

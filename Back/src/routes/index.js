const express = require('express');
const router = express.Router();
// SysHojaVida routes included

// Importar rutas
const healthRoutes = require('./health.routes');
const sysEquipoRoutes = require('./sysequipo.sequelize.routes'); // Rutas mejoradas con Sequelize
const sysHojaVidaRoutes = require('./syshojavida.routes'); // Rutas de hojas de vida IT
const mantenimientoRoutes = require('./mantenimiento.routes'); // Rutas de mantenimiento
const reporteRoutes = require('./reporte.routes'); // Rutas de reportes
const sysMantenimientoRoutes = require('./sysmantenimiento.routes'); // Rutas de mantenimiento de sistemas

// Rutas de la API
router.use('/health', healthRoutes);
router.use('/sysequipo', sysEquipoRoutes); // CRUD completo de equipos de sistemas
router.use('/syshojasdevida', sysHojaVidaRoutes); // CRUD completo de hojas de vida IT
router.use('/mantenimiento', mantenimientoRoutes); // CRUD completo de mantenimientos
router.use('/reportes', reporteRoutes); // CRUD completo de reportes
router.use('/sysmantenimiento', sysMantenimientoRoutes); // CRUD completo de mantenimientos de sistemas

// Ruta raíz de la API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a la API de Hospital San Rafael',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            sysequipo: '/api/sysequipo',
            syshojasdevida: '/api/syshojasdevida',
            mantenimiento: '/api/mantenimiento',
            reportes: '/api/reportes',
            sysmantenimiento: '/api/sysmantenimiento'
        }
    });
});

module.exports = router;

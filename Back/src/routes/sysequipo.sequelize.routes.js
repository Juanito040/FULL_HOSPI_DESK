const express = require('express');
const router = express.Router();
const {
    getAllSysEquipos,
    getSysEquipoById,
    searchSysEquipos,
    createSysEquipo,
    updateSysEquipo,
    patchSysEquipo,
    deleteSysEquipo,
    reactivarSysEquipo,
    darDeBajaSysEquipo,
    getEstadisticasSysEquipos,
    getSysEquiposPorServicio,
    getSysEquiposPorTipo
} = require('../controllers/sysequipo.sequelize.controller');
const { sysEquipoValidator } = require('../middlewares/validators/sysequipo.validator');

// Rutas de consulta
router.get('/stats', getEstadisticasSysEquipos);
router.get('/search', searchSysEquipos);
router.get('/servicio/:servicioId', getSysEquiposPorServicio);
router.get('/tipo/:tipoId', getSysEquiposPorTipo);
router.get('/:id', getSysEquipoById);
router.get('/', getAllSysEquipos);

// Rutas de mutación
router.post('/', sysEquipoValidator, createSysEquipo);
router.put('/:id', sysEquipoValidator, updateSysEquipo);
router.patch('/:id', patchSysEquipo);
router.delete('/:id', deleteSysEquipo);

// Gestión de estado
router.patch('/:id/reactivar', reactivarSysEquipo);
router.post('/:id/baja', darDeBajaSysEquipo);

module.exports = router;

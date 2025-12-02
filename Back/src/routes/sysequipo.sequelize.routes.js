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
    hardDeleteSysEquipo,
    reactivarSysEquipo,
    darDeBajaSysEquipo,
    getEstadisticasSysEquipos,
    getSysEquiposPorServicio,
    getSysEquiposPorTipo,
    getEquiposEnBodega,
    getEquiposDadosDeBaja
} = require('../controllers/sysequipo.sequelize.controller');
const { sysEquipoValidator } = require('../middlewares/validators/sysequipo.validator');

// Rutas de consulta
router.get('/stats', getEstadisticasSysEquipos);
router.get('/bodega', getEquiposEnBodega);
router.get('/dados-baja', getEquiposDadosDeBaja);
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
router.post('/:id/hard-delete', hardDeleteSysEquipo);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllSysHojasVida,
  getSysHojaVidaById,
  getSysHojaVidaByEquipoId,
  createSysHojaVida,
  updateSysHojaVida,
  patchSysHojaVida,
  deleteSysHojaVida,
  searchSysHojasVida,
  getEstadisticasSysHojasVida
} = require('../controllers/syshojavida.controller');
const {
  sysHojaVidaValidator,
  sysHojaVidaPatchValidator
} = require('../middlewares/validators/syshojavida.validator');

// Rutas de consulta
router.get('/stats', getEstadisticasSysHojasVida);
router.get('/search', searchSysHojasVida);
router.get('/equipo/:equipoId', getSysHojaVidaByEquipoId);
router.get('/:id', getSysHojaVidaById);
router.get('/', getAllSysHojasVida);

// Rutas de mutación
router.post('/', sysHojaVidaValidator, createSysHojaVida);
router.put('/:id', sysHojaVidaValidator, updateSysHojaVida);
router.patch('/:id', sysHojaVidaPatchValidator, patchSysHojaVida);
router.delete('/:id', deleteSysHojaVida);

module.exports = router;

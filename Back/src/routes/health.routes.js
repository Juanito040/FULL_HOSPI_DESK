const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/health.controller');

/**
 * @route   GET /api/health
 * @desc    Verificar estado de la API
 * @access  Public
 */
router.get('/', getHealth);

module.exports = router;

const express = require('express');
const router = express.Router();
const catalogosController = require('../controllers/catalogos.controller');

/**
 * @route   GET /api/catalogos/hospitales
 * @desc    Obtener todos los hospitales activos
 * @access  Public
 */
router.get('/hospitales', catalogosController.getHospitales);

/**
 * @route   GET /api/catalogos/servicios
 * @desc    Obtener todos los servicios activos
 * @access  Public
 */
router.get('/servicios', catalogosController.getServicios);

/**
 * @route   GET /api/catalogos/tipos-equipo
 * @desc    Obtener todos los tipos de equipo activos
 * @access  Public
 */
router.get('/tipos-equipo', catalogosController.getTiposEquipo);

/**
 * @route   GET /api/catalogos/all
 * @desc    Obtener todos los catálogos en una sola llamada
 * @access  Public
 */
router.get('/all', catalogosController.getAllCatalogos);

module.exports = router;

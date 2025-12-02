const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const PlanMantenimiento = require('../../models/Biomedica/PlanMantenimiento');
const Reporte = require('../../models/Biomedica/Reporte');
const Usuario = require('../../models/generales/Usuario');
const Equipo = require('../../models/Biomedica/Equipo');

//programar mantenimientos preventivos
router.post('/programacionpreventivos', async (req, res) => {
    const reportes = [];
    try {
        const { mes, anio } = req.body;

        if (!mes || !anio) {
            return res.status(400).json({ error: 'Debe proporcionar mes y año en el cuerpo de la solicitud' });
        }
        const validarReportes = await Reporte.findAll({
            where: {
                mesProgramado: mes,
                añoProgramado: anio,
                tipoMantenimiento: 'Preventivo'
            }
        });
        if (validarReportes.length > 0) {
            return res.status(400).json({ error: 'Ya se realizo la programacion de mantenimientos para el mes seleccionado' });
        }
        const planMantenimiento = await PlanMantenimiento.findAll({
            where: {
                mes: mes,
                ano: anio
            },
            include: ['equipo'],
        });
        for (const plan of planMantenimiento) {
            const nuevoReporte = {
                añoProgramado: plan.ano,
                mesProgramado: plan.mes,
                tipoMantenimiento: 'Preventivo',
                servicioIdFk: plan.equipo.servicioIdFk,
                equipoIdFk: plan.equipo.id
            };
            const reporte = await Reporte.create(nuevoReporte);
            reportes.push(reporte);
        };
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el plan de mantenimiento en la fecha seleccionada', detalle: error.message });
    }
});


router.post('/programacionpreventivosresponsable', async (req, res) => {
  const reportes = [];
  try {
    const { mes, anio } = req.body;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Debe proporcionar mes y año en el cuerpo de la solicitud' });
    }

    const validarReportes = await Reporte.findAll({
      where: {
        mesProgramado: mes,
        añoProgramado: anio,
        tipoMantenimiento: 'Preventivo'
      }
    });
    if (validarReportes.length > 0) {
      return res.status(400).json({ error: 'Ya se realizó la programación de mantenimientos para el mes seleccionado' });
    }
    const planMantenimiento = await PlanMantenimiento.findAll({
      where: {
        mes: mes,
        ano: anio
      },
      include: [{
        model: Equipo,
        as: 'equipo'
      }]
    });

    for (const plan of planMantenimiento) {
      const nuevoReporte = {
        añoProgramado: plan.ano,
        mesProgramado: plan.mes,
        tipoMantenimiento: 'Preventivo',
        servicioIdFk: plan.equipo.servicioIdFk,
        equipoIdFk: plan.equipo.id
      };
      const reporte = await Reporte.create(nuevoReporte);
      reportes.push(reporte);
    }
    const usuarios = await Usuario.findAll({
      where: { estado: true,
               rolId: 7
       },
      attributes: ['id', 'registroInvima']
    });

    console.log('Usuarios encontrados:', usuarios.length);

    const usuariosBasicos = usuarios.filter(u => !u.registroInvima);
    const usuariosAutorizados = usuarios.filter(u => u.registroInvima);

    if (usuariosBasicos.length === 0 || usuariosAutorizados.length === 0) {
      return res.status(400).json({ error: 'No hay suficientes usuarios disponibles para asignar responsables' });
    }
    const reportesConEquipos = await Reporte.findAll({
      where: {
        id: reportes.map(r => r.id)
      },
      include: [{
        model: Equipo,
        as: 'equipo',
        attributes: ['id', 'riesgo']
      }]
    });

    let indexBasico = 0;
    let indexAutorizado = 0;

    for (const reporte of reportesConEquipos) {
      const riesgo = reporte.equipo?.riesgo;
      let usuarioAsignado = null;

      if (riesgo === 'I' || riesgo === 'NA') {
        usuarioAsignado = usuariosBasicos[indexBasico];
        indexBasico = (indexBasico + 1) % usuariosBasicos.length;
      } else if (['IIA', 'IIB', 'III'].includes(riesgo)) {
        usuarioAsignado = usuariosAutorizados[indexAutorizado];
        indexAutorizado = (indexAutorizado + 1) % usuariosAutorizados.length;
      }

      if (usuarioAsignado) {
        reporte.usuarioIdFk = usuarioAsignado.id;
        await reporte.save();
      }
    }

    res.json(reportesConEquipos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el plan de mantenimiento o asignar responsables',
      detalle: error.message
    });
  }
});



module.exports = router;
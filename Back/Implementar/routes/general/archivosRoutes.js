const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/obtenerarchivopdf', (req, res) => {
  const ruta = path.resolve(req.body.ruta);

  fs.access(ruta, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Archivo PDF no encontrado' });
    }
    res.sendFile(ruta, { headers: { 'Content-Type': 'application/pdf' } }, (err) => {
      if (err) {
        console.error('Error al enviar archivo PDF:', err.message);
        return res.status(500).json({ error: 'Error al enviar archivo PDF' });
      }
    });
  });
});

module.exports = router;
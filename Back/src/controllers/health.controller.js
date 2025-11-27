/**
 * Controlador para verificar el estado de la API
 */

const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};

module.exports = {
    getHealth
};

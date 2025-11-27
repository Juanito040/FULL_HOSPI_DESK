const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Rutas
const routes = require('./routes');

// Crear aplicación Express
const app = express();

// Middlewares globales
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (si es necesario)
app.use(express.static('public'));

// Log de peticiones en desarrollo
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Rutas de la API
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor API Hospital San Rafael',
        version: '1.0.0',
        documentation: '/api'
    });
});

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;

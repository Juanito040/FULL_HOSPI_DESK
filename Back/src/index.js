const app = require('./app');
const config = require('./config/config');
const db = require('./models/sequelize');

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos con Sequelize
        await db.testConnection();

        // En desarrollo, puedes sincronizar los modelos automáticamente
        // NOTA: En producción, usa migraciones en lugar de sync
        if (config.nodeEnv === 'development') {
            // sync({ force: true }) BORRA y RECREA todas las tablas
            // sync({ alter: true }) modifica las tablas para que coincidan con los modelos
            // sync() solo crea tablas si no existen
            await db.sync({ alter: false }); // Cambia a true si necesitas actualizar la estructura
            console.log('✓ Modelos sincronizados con la base de datos');
        }

        // Iniciar servidor
        const server = app.listen(config.port, () => {
            console.log('===================================================');
            console.log(`Servidor corriendo en modo: ${config.nodeEnv}`);
            console.log(`Puerto: ${config.port}`);
            console.log(`URL: http://localhost:${config.port}`);
            console.log('===================================================');
        });

        // Manejo de errores no capturados
        process.on('unhandledRejection', async (err) => {
            console.error('Error no manejado:', err);
            await db.close();
            server.close(() => process.exit(1));
        });

        process.on('SIGTERM', async () => {
            console.log('SIGTERM recibido, cerrando servidor...');
            await db.close();
            server.close(() => {
                console.log('Servidor cerrado');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('\nCerrando servidor...');
            await db.close();
            server.close(() => {
                console.log('Servidor cerrado');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar servidor
startServer();

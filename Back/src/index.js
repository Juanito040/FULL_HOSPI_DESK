const app = require('./app');
const config = require('./config/config');
const db = require('./models/sequelize');

// Migración automática: agregar columna caso_ms si no existe
const addCasoMsColumn = async () => {
    try {
        const [columns] = await db.sequelize.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'reporte_backup'
            AND COLUMN_NAME = 'caso_ms'
        `);

        if (columns.length === 0) {
            console.log('→ Agregando columna caso_ms a reporte_backup...');
            await db.sequelize.query(`
                ALTER TABLE reporte_backup
                ADD COLUMN caso_ms ENUM('Si', 'No') NOT NULL DEFAULT 'No'
                AFTER numero_caso_ms
            `);
            console.log('✓ Columna caso_ms agregada exitosamente');
        }
    } catch (error) {
        // Si hay error, no detener el servidor
        console.log('⚠ Advertencia al verificar/agregar caso_ms:', error.message);
    }
};

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos con Sequelize
        await db.testConnection();

        // Ejecutar migraciones automáticas
        await addCasoMsColumn();

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

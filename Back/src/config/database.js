const mysql = require('mysql2');
const config = require('./config');

// Crear pool de conexiones
const pool = mysql.createPool(config.db);

// Crear versión con promesas
const promisePool = pool.promise();

console.log('===================================================');
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log(' ✓ Conexión exitosa a la base de datos MariaDB/MySQL');
        console.log(` ✓ Base de datos: ${config.db.database}`);
        console.log(` ✓ Host: ${config.db.host}:${config.db.port}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ Error al conectar a la base de datos:', error.message);
        return false;
    }
};

// Función para cerrar el pool de conexiones
const closePool = async () => {
    try {
        await promisePool.end();
        console.log('Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error al cerrar pool:', error.message);
    }
};

module.exports = {
    pool,
    promisePool,
    testConnection,
    closePool
};

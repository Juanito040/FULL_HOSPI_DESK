const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

/**
 * Utilidades para inicialización y gestión de base de datos
 */

/**
 * Crear conexión sin especificar base de datos
 */
const createConnectionWithoutDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            multipleStatements: true
        });
        return connection;
    } catch (error) {
        throw new Error(`Error al conectar a MySQL: ${error.message}`);
    }
};

/**
 * Crear conexión a la base de datos específica
 */
const createConnectionWithDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            multipleStatements: true
        });
        return connection;
    } catch (error) {
        throw new Error(`Error al conectar a la base de datos: ${error.message}`);
    }
};

/**
 * Verificar si la base de datos existe
 */
const databaseExists = async () => {
    let connection;
    try {
        connection = await createConnectionWithoutDB();
        const [rows] = await connection.query(
            'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
            [config.db.database]
        );
        return rows.length > 0;
    } catch (error) {
        throw error;
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Crear base de datos
 */
const createDatabase = async () => {
    let connection;
    try {
        connection = await createConnectionWithoutDB();
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${config.db.database}
             CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        console.log(`✓ Base de datos '${config.db.database}' creada exitosamente`);
        return true;
    } catch (error) {
        throw new Error(`Error al crear base de datos: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Eliminar base de datos
 */
const dropDatabase = async () => {
    let connection;
    try {
        connection = await createConnectionWithoutDB();
        await connection.query(`DROP DATABASE IF EXISTS ${config.db.database}`);
        console.log(`✓ Base de datos '${config.db.database}' eliminada exitosamente`);
        return true;
    } catch (error) {
        throw new Error(`Error al eliminar base de datos: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Ejecutar archivo SQL
 */
const executeSQLFile = async (filePath) => {
    let connection;
    try {
        // Leer archivo SQL
        const sqlContent = await fs.readFile(filePath, 'utf8');

        // Crear conexión
        connection = await createConnectionWithDB();

        // Ejecutar SQL
        await connection.query(sqlContent);

        console.log(`✓ Archivo SQL ejecutado: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        throw new Error(`Error al ejecutar ${path.basename(filePath)}: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Ejecutar query SQL directamente
 */
const executeQuery = async (query) => {
    let connection;
    try {
        connection = await createConnectionWithDB();
        const [result] = await connection.query(query);
        return result;
    } catch (error) {
        throw new Error(`Error al ejecutar query: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Obtener lista de tablas
 */
const getTables = async () => {
    let connection;
    try {
        connection = await createConnectionWithDB();
        const [rows] = await connection.query('SHOW TABLES');
        return rows.map(row => Object.values(row)[0]);
    } catch (error) {
        throw new Error(`Error al obtener tablas: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

/**
 * Verificar si una tabla existe
 */
const tableExists = async (tableName) => {
    try {
        const tables = await getTables();
        return tables.includes(tableName);
    } catch (error) {
        throw error;
    }
};

/**
 * Contar registros en una tabla
 */
const countRecords = async (tableName) => {
    let connection;
    try {
        connection = await createConnectionWithDB();
        const [rows] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        return rows[0].total;
    } catch (error) {
        throw new Error(`Error al contar registros en ${tableName}: ${error.message}`);
    } finally {
        if (connection) await connection.end();
    }
};

module.exports = {
    createConnectionWithoutDB,
    createConnectionWithDB,
    databaseExists,
    createDatabase,
    dropDatabase,
    executeSQLFile,
    executeQuery,
    getTables,
    tableExists,
    countRecords
};

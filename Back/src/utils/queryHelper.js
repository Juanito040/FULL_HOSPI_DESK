const { promisePool } = require('../config/database');

/**
 * Ejecuta una query SELECT y retorna los resultados
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros para la query
 * @returns {Promise<Array>} - Resultados de la query
 */
const query = async (sql, params = []) => {
    try {
        const [rows] = await promisePool.query(sql, params);
        return rows;
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};

/**
 * Ejecuta una query y retorna el primer resultado
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros para la query
 * @returns {Promise<Object|null>} - Primer resultado o null
 */
const queryOne = async (sql, params = []) => {
    try {
        const [rows] = await promisePool.query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error en queryOne:', error);
        throw error;
    }
};

/**
 * Ejecuta una query INSERT y retorna el ID insertado
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros para la query
 * @returns {Promise<number>} - ID del registro insertado
 */
const insert = async (sql, params = []) => {
    try {
        const [result] = await promisePool.query(sql, params);
        return result.insertId;
    } catch (error) {
        console.error('Error en insert:', error);
        throw error;
    }
};

/**
 * Ejecuta una query UPDATE y retorna el número de filas afectadas
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros para la query
 * @returns {Promise<number>} - Número de filas afectadas
 */
const update = async (sql, params = []) => {
    try {
        const [result] = await promisePool.query(sql, params);
        return result.affectedRows;
    } catch (error) {
        console.error('Error en update:', error);
        throw error;
    }
};

/**
 * Ejecuta una query DELETE y retorna el número de filas afectadas
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros para la query
 * @returns {Promise<number>} - Número de filas afectadas
 */
const deleteQuery = async (sql, params = []) => {
    try {
        const [result] = await promisePool.query(sql, params);
        return result.affectedRows;
    } catch (error) {
        console.error('Error en delete:', error);
        throw error;
    }
};

/**
 * Ejecuta múltiples queries en una transacción
 * @param {Function} callback - Función que recibe la conexión
 * @returns {Promise<any>} - Resultado de la transacción
 */
const transaction = async (callback) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        console.error('Error en transacción:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    query,
    queryOne,
    insert,
    update,
    delete: deleteQuery,
    transaction
};

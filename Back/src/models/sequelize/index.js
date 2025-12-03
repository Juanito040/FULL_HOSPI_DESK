const { Sequelize } = require('sequelize');
const config = require('../../config/sequelize.config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Objeto para almacenar todos los modelos
const db = {
  sequelize,
  Sequelize
};

// Importar modelos base
db.Rol = require('./rol.model')(sequelize, Sequelize);
db.Usuario = require('./usuario.model')(sequelize, Sequelize);
db.Servicio = require('./servicio.model')(sequelize, Sequelize);
db.TipoEquipo = require('./tipoequipo.model')(sequelize, Sequelize);
db.Sede = require('./sede.model')(sequelize, Sequelize);
db.Responsable = require('./responsable.model')(sequelize, Sequelize);
db.Fabricante = require('./fabricante.model')(sequelize, Sequelize);
db.Proveedor = require('./proveedor.model')(sequelize, Sequelize);
db.DatosTecnicos = require('./datostecnicos.model')(sequelize, Sequelize);
db.TipoDocumento = require('./tipodocumento.model')(sequelize, Sequelize);
db.Hospital = require('./hospital.model')(sequelize, Sequelize);
db.Authorities = require('./authorities.model')(sequelize, Sequelize);
db.UserAuthority = require('./userauthority.model')(sequelize, Sequelize);
db.Licencia = require('./licencia.model')(sequelize, Sequelize);

// Importar modelos de equipos biomédicos
db.Equipo = require('./equipo.model')(sequelize, Sequelize);
db.Documento = require('./documento.model')(sequelize, Sequelize);
db.HojaVida = require('./hojavida.model')(sequelize, Sequelize);

// Importar modelos de equipos de sistemas
db.SysEquipo = require('./sysequipo.model')(sequelize, Sequelize);
db.SysHojaVida = require('./syshojavida.model')(sequelize, Sequelize);
db.SysMantenimiento = require('./sysmantenimiento.model')(sequelize, Sequelize);
db.SysRepuesto = require('./sysrepuestos.model')(sequelize, Sequelize);
db.SysBaja = require('./sysbaja.model')(sequelize, Sequelize);

// Importar modelos de equipos industriales
db.IndEquipo = require('./indequipo.model')(sequelize, Sequelize);
db.IndHojaVida = require('./indhojavida.model')(sequelize, Sequelize);

// Importar modelos de mantenimiento y reportes
db.Reporte = require('./reporte.model')(sequelize, Sequelize);
db.MantenimientoPreventivo = require('./mantenimientoPreventivo.model')(sequelize, Sequelize);
db.ProtocoloPreventivo = require('./protocoloPreventivo.model')(sequelize, Sequelize);
db.MantenimientoMSV = require('./mantenimientoMSV.model')(sequelize, Sequelize);
db.Repuesto = require('./repuesto.model')(sequelize, Sequelize);
db.Llamado = require('./llamado.model')(sequelize, Sequelize);

// Importar modelos de actividades metrológicas y planes
db.ActividadMetrologica = require('./actividadMetrologica.model')(sequelize, Sequelize);
db.PlanActividadMetrologica = require('./planActividadMetrologica.model')(sequelize, Sequelize);
db.PlanMantenimiento = require('./planMantenimiento.model')(sequelize, Sequelize);
// TEMPORAL: Comentado para permitir que el servidor inicie
// db.CumplimientoProtocoloPreventivo = require('./cumplimientoProtocoloPreventivo.model')(sequelize, Sequelize);

// Importar modelos de sistemas
db.Backup = require('./backup.model')(sequelize, Sequelize);

// Definir asociaciones/relaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Función para probar la conexión
db.testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión exitosa a la base de datos con Sequelize');
    console.log(`✓ Base de datos: ${dbConfig.database}`);
    console.log(`✓ Host: ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con Sequelize:', error.message);
    return false;
  }
};

// Función para sincronizar modelos (solo desarrollo)
db.sync = async (options = {}) => {
  if (env === 'production') {
    console.warn('⚠ No se puede sincronizar en producción. Usa migraciones.');
    return;
  }
  try {
    await sequelize.sync(options);
    console.log('✓ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('✗ Error al sincronizar modelos:', error.message);
    throw error;
  }
};

// Función para cerrar la conexión
db.close = async () => {
  try {
    await sequelize.close();
    console.log('✓ Conexión cerrada');
  } catch (error) {
    console.error('✗ Error al cerrar conexión:', error.message);
  }
};

module.exports = db;

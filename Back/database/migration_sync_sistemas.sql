-- ========================================
-- SCRIPT DE MIGRACIÓN - MÓDULO DE SISTEMAS
-- Fecha: 2025-12-03
-- Propósito: Sincronizar BD actual con schema proporcionado
-- ========================================

-- IMPORTANTE: Realizar BACKUP de la base de datos antes de ejecutar este script
-- Comando: mysqldump -u usuario -p db_hospi > backup_$(date +%Y%m%d_%H%M%S).sql

USE db_hospi;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 1. MIGRACIÓN TABLA SYSEQUIPO
-- ========================================

-- Agregar campos faltantes
ALTER TABLE sysequipo
    ADD COLUMN IF NOT EXISTS preventivo_s BIT NULL COMMENT 'Indica si tiene mantenimiento preventivo' AFTER mtto,
    ADD COLUMN IF NOT EXISTS fecha_modificacion DATE NULL COMMENT 'Fecha de última modificación del equipo' AFTER preventivo_s,
    ADD COLUMN IF NOT EXISTS ubicacion_anterior VARCHAR(255) NULL COMMENT 'Ubicación anterior del equipo' AFTER fecha_modificacion;

-- Modificar tipos de datos
ALTER TABLE sysequipo
    MODIFY COLUMN marca VARCHAR(255) NOT NULL COMMENT 'Marca del equipo',
    MODIFY COLUMN serie VARCHAR(80) NOT NULL COMMENT 'Número de serie',
    MODIFY COLUMN ano_ingreso DATE NULL COMMENT 'Fecha de ingreso del equipo',
    MODIFY COLUMN dias_mantenimiento VARCHAR(255) NULL COMMENT 'Días de mantenimiento',
    MODIFY COLUMN mtto INT NULL COMMENT 'Tipo de mantenimiento',
    MODIFY COLUMN direccionamiento_Vlan VARCHAR(30) DEFAULT ' ' COMMENT 'Direccionamiento VLAN',
    MODIFY COLUMN activo BIT NULL COMMENT 'Estado activo/inactivo',
    MODIFY COLUMN estado_baja BIT DEFAULT b'0' COMMENT 'Estado de baja',
    MODIFY COLUMN administrable BIT DEFAULT b'0' COMMENT 'Es administrable';

-- ========================================
-- 2. MIGRACIÓN TABLA SYSHOJA_VIDA
-- ========================================

-- Agregar campos faltantes
ALTER TABLE syshoja_vida
    ADD COLUMN IF NOT EXISTS asignadoporgobernacion BIT NULL COMMENT 'Asignado por gobernación' AFTER comodato,
    ADD COLUMN IF NOT EXISTS asignadoporministerio BIT NULL COMMENT 'Asignado por ministerio' AFTER asignadoporgobernacion,
    ADD COLUMN IF NOT EXISTS departamento VARCHAR(255) NULL COMMENT 'Departamento' AFTER asignadoporministerio,
    ADD COLUMN IF NOT EXISTS direccion VARCHAR(255) NULL COMMENT 'Dirección' AFTER departamento,
    ADD COLUMN IF NOT EXISTS emailinstitucion VARCHAR(255) NULL COMMENT 'Email de la institución' AFTER direccion,
    ADD COLUMN IF NOT EXISTS fecha_iniciooperacion DATE NULL COMMENT 'Fecha de inicio de operación' AFTER fecha_instalacion,
    ADD COLUMN IF NOT EXISTS fecha_vencimientogarantia DATE NULL COMMENT 'Fecha de vencimiento de garantía' AFTER fecha_iniciooperacion,
    ADD COLUMN IF NOT EXISTS municipio VARCHAR(255) NULL COMMENT 'Municipio' AFTER fecha_vencimientogarantia,
    ADD COLUMN IF NOT EXISTS nivelinstitucion VARCHAR(255) NULL COMMENT 'Nivel de institución' AFTER municipio,
    ADD COLUMN IF NOT EXISTS telefonoinstitucion VARCHAR(255) NULL COMMENT 'Teléfono de institución' AFTER nivelinstitucion,
    ADD COLUMN IF NOT EXISTS fecha_update DATE NULL COMMENT 'Fecha de actualización' AFTER telefonoinstitucion;

-- Modificar tipos de datos
ALTER TABLE syshoja_vida
    MODIFY COLUMN costo_compra VARCHAR(255) NULL COMMENT 'Costo de compra',
    MODIFY COLUMN vendedor VARCHAR(150) DEFAULT '' COMMENT 'Vendedor',
    MODIFY COLUMN tipo_uso VARCHAR(50) DEFAULT '' COMMENT 'Tipo de uso',
    MODIFY COLUMN observaciones VARCHAR(255) NULL COMMENT 'Observaciones',
    MODIFY COLUMN fecha_compra DATE NULL COMMENT 'Fecha de compra',
    MODIFY COLUMN fecha_instalacion DATE NULL COMMENT 'Fecha de instalación',
    MODIFY COLUMN compraddirecta BIT DEFAULT b'0' COMMENT 'Compra directa',
    MODIFY COLUMN convenio BIT DEFAULT b'0' COMMENT 'Convenio',
    MODIFY COLUMN donado BIT DEFAULT b'0' COMMENT 'Donado',
    MODIFY COLUMN comodato BIT DEFAULT b'0' COMMENT 'Comodato';

-- ========================================
-- 3. MIGRACIÓN TABLA SYSMANTENIMIENTO (CRÍTICA)
-- ========================================

-- PASO 1: Crear tabla de respaldo temporal
CREATE TABLE IF NOT EXISTS sysmantenimiento_backup_20251203 AS
SELECT * FROM sysmantenimiento;

-- PASO 2: Crear columnas temporales para la migración de ENUMs a INT
ALTER TABLE sysmantenimiento
    ADD COLUMN IF NOT EXISTS tipo_mantenimiento_int INT NULL COMMENT 'Tipo de mantenimiento (temp)',
    ADD COLUMN IF NOT EXISTS tipo_falla_int INT NULL COMMENT 'Tipo de falla (temp)';

-- PASO 3: Mapear valores ENUM a INT
-- Tipo Mantenimiento: 1=Correctivo, 2=Preventivo, 3=Predictivo, 4=Otro
UPDATE sysmantenimiento
SET tipo_mantenimiento_int = CASE
    WHEN tipo_mantenimiento = 'Correctivo' THEN 1
    WHEN tipo_mantenimiento = 'Preventivo' THEN 2
    WHEN tipo_mantenimiento = 'Predictivo' THEN 3
    WHEN tipo_mantenimiento = 'Otro' THEN 4
    ELSE NULL
END
WHERE tipo_mantenimiento IS NOT NULL;

-- Tipo Falla: 1=Desgaste, 2=Operación Indebida, 3=Causa Externa, 4=Accesorios,
--             5=Desconocido, 6=Sin Falla, 7=Otros, 8=No Registra
UPDATE sysmantenimiento
SET tipo_falla_int = CASE
    WHEN tipo_falla = 'Desgaste' THEN 1
    WHEN tipo_falla = 'Operación Indebida' THEN 2
    WHEN tipo_falla = 'Causa Externa' THEN 3
    WHEN tipo_falla = 'Accesorios' THEN 4
    WHEN tipo_falla = 'Desconocido' THEN 5
    WHEN tipo_falla = 'Sin Falla' THEN 6
    WHEN tipo_falla = 'Otros' THEN 7
    WHEN tipo_falla = 'No Registra' THEN 8
    ELSE NULL
END
WHERE tipo_falla IS NOT NULL;

-- PASO 4: Eliminar columnas ENUM originales
ALTER TABLE sysmantenimiento
    DROP COLUMN tipo_mantenimiento,
    DROP COLUMN tipo_falla;

-- PASO 5: Renombrar columnas temporales
ALTER TABLE sysmantenimiento
    CHANGE COLUMN tipo_mantenimiento_int tipo_mantenimiento INT NULL,
    CHANGE COLUMN tipo_falla_int tipo_falla INT NULL;

-- PASO 6: Crear columnas temporales para campos BIT
ALTER TABLE sysmantenimiento
    ADD COLUMN IF NOT EXISTS mphardware_bit BIT NULL,
    ADD COLUMN IF NOT EXISTS mpsoftware_bit BIT NULL,
    ADD COLUMN IF NOT EXISTS dano_bit BIT NULL,
    ADD COLUMN IF NOT EXISTS entega_bit BIT NULL;

-- PASO 7: Migrar datos de TEXT a BIT (cualquier texto = 1, null = 0)
UPDATE sysmantenimiento
SET mphardware_bit = CASE WHEN mphardware IS NOT NULL AND mphardware != '' THEN b'1' ELSE b'0' END,
    mpsoftware_bit = CASE WHEN mpsoftware IS NOT NULL AND mpsoftware != '' THEN b'1' ELSE b'0' END,
    dano_bit = CASE WHEN dano IS NOT NULL AND dano != '' THEN b'1' ELSE b'0' END,
    entega_bit = CASE WHEN entega IS NOT NULL AND entega != '' THEN b'1' ELSE b'0' END;

-- PASO 8: Crear columnas de texto para guardar contenido
ALTER TABLE sysmantenimiento
    ADD COLUMN IF NOT EXISTS mphardware_texto TEXT NULL COMMENT 'Texto de mantenimiento hardware (legacy)',
    ADD COLUMN IF NOT EXISTS mpsoftware_texto TEXT NULL COMMENT 'Texto de mantenimiento software (legacy)',
    ADD COLUMN IF NOT EXISTS dano_texto TEXT NULL COMMENT 'Texto de daño (legacy)',
    ADD COLUMN IF NOT EXISTS entega_texto TEXT NULL COMMENT 'Texto de entrega (legacy)';

-- PASO 9: Copiar contenido a columnas legacy
UPDATE sysmantenimiento
SET mphardware_texto = mphardware,
    mpsoftware_texto = mpsoftware,
    dano_texto = dano,
    entega_texto = entega;

-- PASO 10: Eliminar columnas TEXT originales
ALTER TABLE sysmantenimiento
    DROP COLUMN mphardware,
    DROP COLUMN mpsoftware,
    DROP COLUMN dano,
    DROP COLUMN entega;

-- PASO 11: Renombrar columnas BIT a nombres originales
ALTER TABLE sysmantenimiento
    CHANGE COLUMN mphardware_bit mphardware BIT NULL,
    CHANGE COLUMN mpsoftware_bit mpsoftware BIT NULL,
    CHANGE COLUMN dano_bit dano BIT NULL,
    CHANGE COLUMN entega_bit entega BIT NULL;

-- PASO 12: Modificar tipos de datos para rutinas
ALTER TABLE sysmantenimiento
    MODIFY COLUMN rutinah VARCHAR(255) NULL COMMENT 'Rutinas de hardware',
    MODIFY COLUMN rutinas VARCHAR(255) NULL COMMENT 'Rutinas de software';

-- PASO 13: Modificar campos de rutas a TEXT
ALTER TABLE sysmantenimiento
    MODIFY COLUMN rutahardware TEXT NULL COMMENT 'Ruta del PDF de mantenimiento hardware',
    MODIFY COLUMN rutasoftware TEXT NULL COMMENT 'Ruta del PDF de mantenimiento software',
    MODIFY COLUMN rutaentrega TEXT NULL COMMENT 'Ruta del PDF de entrega';

-- ========================================
-- 4. MIGRACIÓN TABLA SYSREPUESTOS
-- ========================================

ALTER TABLE sysrepuestos
    MODIFY COLUMN observaciones VARCHAR(255) NULL COMMENT 'Observaciones',
    MODIFY COLUMN nombre_equipo VARCHAR(255) NULL COMMENT 'Nombre del equipo',
    MODIFY COLUMN activo BIT NULL COMMENT 'Estado activo/inactivo';

-- ========================================
-- 5. TABLA SYSBAJA (NO REQUIERE CAMBIOS)
-- ========================================
-- Esta tabla ya coincide con el schema proporcionado

-- Rehabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ========================================

-- Verificar estructura de sysequipo
SELECT 'Verificando sysequipo...' AS mensaje;
DESCRIBE sysequipo;

-- Verificar estructura de syshoja_vida
SELECT 'Verificando syshoja_vida...' AS mensaje;
DESCRIBE syshoja_vida;

-- Verificar estructura de sysmantenimiento
SELECT 'Verificando sysmantenimiento...' AS mensaje;
DESCRIBE sysmantenimiento;

-- Verificar estructura de sysrepuestos
SELECT 'Verificando sysrepuestos...' AS mensaje;
DESCRIBE sysrepuestos;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
/*
1. Este script crea una tabla de respaldo: sysmantenimiento_backup_20251203
2. Los datos de tipo ENUM han sido convertidos a INT según este mapeo:

   TIPO_MANTENIMIENTO:
   1 = Correctivo
   2 = Preventivo
   3 = Predictivo
   4 = Otro

   TIPO_FALLA:
   1 = Desgaste
   2 = Operación Indebida
   3 = Causa Externa
   4 = Accesorios
   5 = Desconocido
   6 = Sin Falla
   7 = Otros
   8 = No Registra

3. Los campos que eran TEXT y ahora son BIT mantienen su contenido en columnas *_texto
4. Campos agregados con valores NULL por defecto - revisar si necesitan valores
5. Actualizar los modelos Sequelize después de ejecutar este script

SIGUIENTE PASO:
- Ejecutar script de actualización de modelos Sequelize
- Actualizar controladores y servicios que usan ENUMs
- Actualizar frontend para manejar valores INT en lugar de strings
*/

SELECT '==================================' AS ' ';
SELECT 'MIGRACIÓN COMPLETADA EXITOSAMENTE' AS ' ';
SELECT '==================================' AS ' ';

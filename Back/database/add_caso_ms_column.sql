-- Migración: Agregar columna caso_ms a la tabla reporte_backup
-- Fecha: 2025-12-02
-- Descripción: Agrega la columna caso_ms faltante que el modelo requiere

USE db_hospi;

-- Agregar la columna caso_ms con valor por defecto 'No'
ALTER TABLE reporte_backup
ADD COLUMN caso_ms ENUM('Si', 'No') NOT NULL DEFAULT 'No'
AFTER numero_caso_ms;

-- Verificar que la columna se agregó correctamente
DESCRIBE reporte_backup;

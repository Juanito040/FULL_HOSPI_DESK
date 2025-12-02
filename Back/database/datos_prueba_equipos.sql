-- ============================================================
-- SCRIPT DE DATOS DE PRUEBA - EQUIPO CON HOJA DE VIDA
-- Hospital San Rafael - Sistema de Gestión de Equipos
-- ============================================================

-- 1. Insertar un equipo de prueba
INSERT INTO `sysequipo` (
  `nombre_equipo`,
  `marca`,
  `modelo`,
  `serie`,
  `placa_inventario`,
  `codigo`,
  `ubicacion`,
  `ubicacion_especifica`,
  `activo`,
  `ano_ingreso`,
  `dias_mantenimiento`,
  `periodicidad`,
  `estado_baja`,
  `administrable`,
  `direccionamiento_Vlan`,
  `numero_puertos`,
  `mtto`,
  `id_hospital_fk`,
  `id_servicio_fk`,
  `id_tipo_equipo_fk`,
  `id_usuario_fk`,
  `createdAt`,
  `updatedAt`
) VALUES (
  'Servidor Web Apache Prueba',           -- nombre_equipo
  'Dell',                                  -- marca
  'PowerEdge R740',                        -- modelo
  'SRV-2024-001',                         -- serie
  'INV-2024-0001',                        -- placa_inventario
  'COD-APACHE-001',                       -- codigo
  'Sala de Servidores',                   -- ubicacion
  'Rack 5, Posición 2',                   -- ubicacion_especifica
  1,                                       -- activo
  2024,                                    -- ano_ingreso
  30,                                      -- dias_mantenimiento
  30,                                      -- periodicidad
  0,                                       -- estado_baja
  1,                                       -- administrable
  '192.168.1.100',                        -- direccionamiento_Vlan
  4,                                       -- numero_puertos
  1,                                       -- mtto
  1,                                       -- id_hospital_fk (ajusta si es necesario)
  1,                                       -- id_servicio_fk (ajusta si es necesario)
  1,                                       -- id_tipo_equipo_fk (ajusta si es necesario)
  1,                                       -- id_usuario_fk (Usuario Admin)
  NOW(),                                   -- createdAt
  NOW()                                    -- updatedAt
);

-- Obtener el ID del equipo insertado (guárdalo para usarlo en la hoja de vida)
-- SELECT LAST_INSERT_ID() as id_equipo_insertado;

-- 2. Insertar la hoja de vida asociada
-- NOTA: Reemplaza @id_sysequipo con el ID real del equipo creado arriba
-- O ejecuta esta parte después de saber el ID

SET @id_sysequipo = LAST_INSERT_ID();

INSERT INTO `syshoja_vida` (
  `ip`,
  `mac`,
  `procesador`,
  `ram`,
  `disco_duro`,
  `sistema_operativo`,
  `office`,
  `tonner`,
  `nombre_usuario`,
  `vendedor`,
  `tipo_uso`,
  `fecha_compra`,
  `fecha_instalacion`,
  `costo_compra`,
  `contrato`,
  `observaciones`,
  `foto`,
  `compraddirecta`,
  `id_sysequipo_fk`,
  `createdAt`,
  `updatedAt`
) VALUES (
  '192.168.1.100',                        -- ip
  '00:0A:95:9D:68:16',                    -- mac
  'Intel Xeon Gold 6248 (2 x 20 cores)',  -- procesador
  '128 GB DDR4',                          -- ram
  '2 x 960 GB SSD NVMe',                  -- disco_duro
  'Ubuntu Server 22.04 LTS',              -- sistema_operativo
  'N/A',                                  -- office
  'N/A',                                  -- tonner
  'admin',                                -- nombre_usuario
  'Dell Technologies',                    -- vendedor
  'Servidor Web',                         -- tipo_uso
  '2024-01-15',                           -- fecha_compra
  '2024-02-01',                           -- fecha_instalacion
  15000000,                               -- costo_compra (COP)
  'DTC-2024-001',                         -- contrato
  'Servidor de prueba para ambiente de desarrollo. Configuración de alta disponibilidad.',
  NULL,                                   -- foto
  1,                                      -- compraddirecta (Sí)
  @id_sysequipo,                          -- id_sysequipo_fk (Referencia al equipo)
  NOW(),                                  -- createdAt
  NOW()                                   -- updatedAt
);

-- ============================================================
-- DATOS DE PRUEBA ADICIONALES (OPCIONAL)
-- ============================================================

-- 3. Insertar un segundo equipo de prueba (Computador de Usuario)
INSERT INTO `sysequipo` (
  `nombre_equipo`,
  `marca`,
  `modelo`,
  `serie`,
  `placa_inventario`,
  `codigo`,
  `ubicacion`,
  `ubicacion_especifica`,
  `activo`,
  `ano_ingreso`,
  `dias_mantenimiento`,
  `periodicidad`,
  `estado_baja`,
  `administrable`,
  `direccionamiento_Vlan`,
  `numero_puertos`,
  `mtto`,
  `id_hospital_fk`,
  `id_servicio_fk`,
  `id_tipo_equipo_fk`,
  `id_usuario_fk`,
  `createdAt`,
  `updatedAt`
) VALUES (
  'Computador Administrativo Prueba',
  'Lenovo',
  'ThinkCentre M90',
  'PC-2024-002',
  'INV-2024-0002',
  'COD-PC-002',
  'Área Administrativa',
  'Escritorio Piso 1',
  1,
  2024,
  60,
  60,
  0,
  0,
  '192.168.1.50',
  1,
  0,
  1,
  1,
  2,
  1,
  NOW(),
  NOW()
);

-- 4. Insertar hoja de vida para el computador
SET @id_pc = LAST_INSERT_ID();

INSERT INTO `syshoja_vida` (
  `ip`,
  `mac`,
  `procesador`,
  `ram`,
  `disco_duro`,
  `sistema_operativo`,
  `office`,
  `tonner`,
  `nombre_usuario`,
  `vendedor`,
  `tipo_uso`,
  `fecha_compra`,
  `fecha_instalacion`,
  `costo_compra`,
  `contrato`,
  `observaciones`,
  `foto`,
  `compraddirecta`,
  `id_sysequipo_fk`,
  `createdAt`,
  `updatedAt`
) VALUES (
  '192.168.1.50',
  '08:00:27:C7:A6:1F',
  'Intel Core i7-10700K',
  '16 GB DDR4',
  '512 GB SSD',
  'Windows 11 Pro',
  'Microsoft Office 2021',
  'N/A',
  'jperez',
  'Lenovo',
  'Oficina - Administración',
  '2023-06-20',
  '2023-07-05',
  3500000,
  'DTC-2023-045',
  'Computador de uso administrativo. En buen estado.',
  NULL,
  0,
  @id_pc,
  NOW(),
  NOW()
);

-- ============================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================

-- Mostrar equipos de prueba creados
SELECT 
  id_sysequipo,
  nombre_equipo,
  marca,
  modelo,
  serie,
  ubicacion,
  estado_baja,
  createdAt
FROM `sysequipo`
WHERE nombre_equipo LIKE '%Prueba%'
ORDER BY id_sysequipo DESC;

-- Mostrar hojas de vida asociadas
SELECT 
  id_syshoja_vida,
  ip,
  mac,
  sistema_operativo,
  nombre_usuario,
  id_sysequipo_fk,
  createdAt
FROM `syshoja_vida`
WHERE id_sysequipo_fk IN (
  SELECT id_sysequipo FROM `sysequipo` WHERE nombre_equipo LIKE '%Prueba%'
)
ORDER BY id_syshoja_vida DESC;

-- ============================================================
-- CONSULTA PARA VER EQUIPOS CON SUS HOJAS DE VIDA
-- ============================================================

SELECT 
  e.id_sysequipo,
  e.nombre_equipo,
  e.marca,
  e.modelo,
  e.serie,
  e.ubicacion,
  hv.id_syshoja_vida,
  hv.ip,
  hv.mac,
  hv.sistema_operativo,
  hv.nombre_usuario,
  e.activo,
  e.createdAt
FROM `sysequipo` e
LEFT JOIN `syshoja_vida` hv ON e.id_sysequipo = hv.id_sysequipo_fk
WHERE e.nombre_equipo LIKE '%Prueba%'
ORDER BY e.id_sysequipo DESC;

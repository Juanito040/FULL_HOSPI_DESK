

USE db_hospi;

-- ========================================
-- DATOS BASE
-- ========================================

-- Roles
INSERT INTO rol (nombre) VALUES
('Administrador'),
('Ingeniero Biomédico'),
('Técnico de Sistemas'),
('Médico'),
('Enfermera');

-- Hospitales
INSERT INTO hospital (nombre_hospital, direccion_hospital, nit_hospital, ciudad, departamento, estado, nivel) VALUES
('Hospital San Rafael', 'Calle 10 #15-20', '900123456-1', 'Tunja', 'Boyacá', 1, 3),
('Clínica Los Andes', 'Carrera 5 #8-30', '900123457-2', 'Duitama', 'Boyacá', 1, 2);

-- Sedes
INSERT INTO sede (nombres, direccion, nit, ciudad, departamento, estado, nivel) VALUES
('Sede Principal', 'Calle 10 #15-20', '900123456-1', 'Tunja', 'Boyacá', 1, 3),
('Sede Norte', 'Av. Norte #25-40', '900123456-1', 'Tunja', 'Boyacá', 1, 2);

-- Servicios
INSERT INTO servicio (nombres, ubicacion, activo) VALUES
('Urgencias', 'Piso 1 - Ala Este', 1),
('Quirófano', 'Piso 2 - Central', 1),
('UCI', 'Piso 3 - Ala Oeste', 1),
('Laboratorio Clínico', 'Piso 1 - Ala Oeste', 1),
('Radiología', 'Piso 1 - Ala Norte', 1),
('Sistemas', 'Piso 4 - Datacenter', 1),
('Mantenimiento', 'Sótano - Área Técnica', 1);

-- Tipos de Documento
INSERT INTO tipodocumento (nombres) VALUES
('Manual de Usuario'),
('Manual Técnico'),
('Hoja de Vida'),
('Certificado de Calibración'),
('Póliza de Garantía'),
('Factura de Compra');

-- Tipos de Equipo
INSERT INTO tipoequipo (nombres, materialConsumible, herramienta, tiempoMinutos, repuestosMinimos, tipoR, actividad, activo) VALUES
('Monitor de Signos Vitales', 'Electrodos, gel conductor', 'Multímetro, destornilladores', '45', 'Cable de poder, fusibles', 1, 'Limpieza, calibración de sensores', 1),
('Ventilador Mecánico', 'Filtros HEPA, circuitos respiratorios', 'Analizador de gases, manómetro', '60', 'Válvulas, sensores de presión', 1, 'Verificación de alarmas, calibración', 1),
('Desfibrilador', 'Electrodos desechables, gel', 'Analizador de desfibriladores', '30', 'Batería, palas', 1, 'Prueba de carga, calibración de energía', 1),
('Computador de Escritorio', 'Ninguno', 'Destornilladores, multímetro', '30', 'Disco duro, RAM', 0, 'Limpieza física, actualización de software', 1),
('Switch de Red', 'Ninguno', 'Cable tester, multímetro', '20', 'Fuente de poder', 0, 'Verificación de puertos, actualización firmware', 1),
('Servidor', 'Ninguno', 'Herramientas de diagnóstico', '45', 'Discos duros, RAM, fuente de poder', 0, 'Verificación de RAID, actualización de OS', 1);

-- Fabricantes
INSERT INTO fabricante (nombres, pais, estado) VALUES
('Philips Healthcare', 'Países Bajos', 1),
('GE Healthcare', 'Estados Unidos', 1),
('Siemens Healthineers', 'Alemania', 1),
('Dell Technologies', 'Estados Unidos', 1),
('Cisco Systems', 'Estados Unidos', 1),
('HP Inc', 'Estados Unidos', 1);

-- Proveedores
INSERT INTO proveedor (nombres, telefono, correo, ciudad, representante, telRepresentante, estado) VALUES
('MediTech Colombia', '3101234567', 'ventas@meditech.com.co', 'Bogotá', 'Carlos Rodríguez', '3109876543', 1),
('Equipos Médicos del Centro', '3207654321', 'info@equiposmedicos.com', 'Tunja', 'María González', '3156789012', 1),
('Sistemas y Redes SAS', '3123456789', 'comercial@sistemasredes.com', 'Bogotá', 'Juan Pérez', '3145678901', 1);

-- Responsables
INSERT INTO responsable (nombres, garantia, externo, calificacion) VALUES
('Ing. Pedro Martínez', 0, 0, 5),
('Téc. Laura Sánchez', 0, 0, 4),
('Ing. Carlos Rodríguez - MediTech', 1, 1, 5);

-- Usuarios
INSERT INTO usuario (nombres, apellidos, nombreUsuario, tipoId, numeroId, telefono, email, contraseña, registroInvima, estado, rolId) VALUES
('Administrador', 'Sistema', 'admin', 'CC', '1000000000', '3001234567', 'admin@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'N/A', 1, 1),
('Juan Carlos', 'Ramírez', 'jramirez', 'CC', '1234567890', '3101234567', 'jramirez@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'REG-001', 1, 2),
('María Fernanda', 'López', 'mlopez', 'CC', '0987654321', '3209876543', 'mlopez@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'REG-002', 1, 3);

-- ========================================
-- DATOS TÉCNICOS
-- ========================================

-- Datos Técnicos para equipos biomédicos
INSERT INTO datostecnicos (vMaxOperacion, vMinOperacion, iMaxOperacion, iMinOperacion, wConsumida, frecuencia, presion, velocidad, temperatura, peso, capacidad) VALUES
('220V', '110V', '5A', '1A', '500W', '60Hz', 'N/A', 'N/A', '25°C', '15kg', 'N/A'),
('240V', '100V', '10A', '2A', '1200W', '50-60Hz', '50PSI', 'N/A', '30°C', '45kg', 'N/A');

-- ========================================
-- EQUIPOS DE SISTEMAS (EJEMPLO)
-- ========================================
-- Solo los 15 campos requeridos

INSERT INTO sysequipo (
    serie,
    nombre_equipo,
    marca,
    modelo,
    ano_ingreso,
    placa_inventario,
    id_servicio_fk,
    ubicacion,
    ubicacion_especifica,
    codigo,
    activo,
    ingresa_servicios,
    requiere_mtto_software,
    id_tipo_equipo_fk,
    responsable_mtto
) VALUES
('FCW2145L0ME', 'Switch Cisco Core 48 Puertos', 'Cisco', 'Catalyst 2960-X', 2023, 'SW-CORE-001', 6, 'Datacenter Principal', 'Rack A - U10', 'NET-001', 1, 1, 0, 5, 'Ing. Carlos Rodríguez'),
('DELL-DB-001', 'Servidor Dell Base de Datos', 'Dell', 'PowerEdge R740', 2023, 'SRV-DB-001', 6, 'Datacenter Principal', 'Rack A - U15', 'SRV-001', 1, 1, 1, 6, 'Ing. Pedro Martínez'),
('HP-APP-001', 'Servidor HP Aplicaciones', 'HP', 'ProLiant DL380 Gen10', 2022, 'SRV-APP-001', 6, 'Datacenter Principal', 'Rack B - U10', 'SRV-002', 1, 1, 1, 6, 'Ing. Pedro Martínez'),
('DELL-PC-ADM-01', 'PC Admisiones 01', 'Dell', 'OptiPlex 7090', 2024, 'PC-ADM-001', 1, 'Área Administrativa', 'Recepción Principal', 'PC-001', 1, 0, 1, 4, 'Téc. Laura Sánchez'),
('HP-PC-UCI-01', 'PC Enfermería UCI 01', 'HP', 'EliteDesk 800 G6', 2024, 'PC-UCI-001', 3, 'UCI', 'Estación de Enfermería', 'PC-015', 1, 0, 1, 4, 'Téc. Laura Sánchez');

-- Hojas de Vida para equipos de sistemas
INSERT INTO syshoja_vida (ip, mac, procesador, ram, disco_duro, sistema_operativo, office, tonner, nombre_usuario, vendedor, tipo_uso, fecha_compra, fecha_instalacion, costo_compra, contrato, observaciones, foto, compraddirecta, convenio, donado, comodato, id_sysequipo_fk) VALUES
('192.168.1.254', '00:1A:2B:3C:4D:5E', 'N/A', 'N/A', 'N/A', 'Cisco IOS 15.2', 'N/A', 'N/A', 'Admin de Red', 'Sistemas y Redes SAS', 'Networking - Core Switch', '2023-01-15', '2023-01-20', 8500000, 'CT-2023-001', 'Switch principal del datacenter', NULL, 1, 0, 0, 0, 1),
('192.168.1.10', '00:1A:2B:3C:4D:5F', 'Intel Xeon Silver 4214', '64GB DDR4', '2TB SSD RAID 1', 'Ubuntu Server 22.04 LTS', 'N/A', 'N/A', 'DBA', 'Sistemas y Redes SAS', 'Servidor de Base de Datos', '2023-02-10', '2023-02-15', 18000000, 'CT-2023-002', 'Servidor principal MySQL/MariaDB', NULL, 1, 0, 0, 0, 2),
('192.168.1.11', '00:1A:2B:3C:4D:60', 'Intel Xeon Gold 5218', '128GB DDR4', '4TB SSD RAID 5', 'Windows Server 2022', 'N/A', 'N/A', 'Admin de Sistemas', 'Sistemas y Redes SAS', 'Servidor de Aplicaciones', '2022-11-05', '2022-11-10', 22000000, 'CT-2022-005', 'Servidor para aplicaciones web HIS', NULL, 1, 0, 0, 0, 3),
('192.168.2.50', '00:1A:2B:3C:4D:61', 'Intel Core i5-11500', '16GB DDR4', '512GB SSD', 'Windows 11 Pro', 'Office 2021', 'N/A', 'Recepcionista', 'Sistemas y Redes SAS', 'Estación de Trabajo Administrativa', '2024-01-10', '2024-01-12', 2500000, 'CT-2024-001', 'PC para área de admisiones', NULL, 1, 0, 0, 0, 4),
('192.168.3.10', '00:1A:2B:3C:4D:62', 'Intel Core i7-10700', '32GB DDR4', '1TB SSD', 'Windows 11 Pro', 'Office 2021', 'N/A', 'Enfermera UCI', 'Sistemas y Redes SAS', 'Estación Médica UCI', '2024-02-05', '2024-02-07', 3800000, 'CT-2024-003', 'Equipo para estación de enfermería UCI', NULL, 1, 0, 0, 0, 5);

-- ========================================
-- MENSAJE FINAL
-- ========================================

SELECT 'Datos de ejemplo insertados exitosamente' AS Mensaje;
SELECT COUNT(*) AS 'Total Equipos de Sistemas' FROM sysequipo;

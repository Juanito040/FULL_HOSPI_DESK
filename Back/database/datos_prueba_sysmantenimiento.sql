-- ========================================
-- DATOS DE PRUEBA PARA SYSMANTENIMIENTO
-- Hospital San Rafael
-- ========================================

-- Insertar mantenimiento preventivo completo
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, hora_llamado, hora_inicio, hora_terminacion,
    tipo_mantenimiento, tipo_falla, mphardware, mpsoftware,
    rutinah, rutinas, observacionesh, observacioness,
    autor_realizado, autor_recibido, tiempo_fuera_servicio,
    dano, entega, rutahardware, rutasoftware, rutaentrega,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'PREV-SYS-2025-001',
    '2025-11-01',
    '08:00:00',
    '08:30:00',
    '10:30:00',
    'Preventivo',
    'Sin Falla',
    '1. Limpieza interna de componentes\n2. Revisión de ventiladores y disipadores\n3. Verificación de conexiones de cables\n4. Limpieza de puertos USB y red',
    '1. Actualización de sistema operativo Windows\n2. Actualización de antivirus\n3. Limpieza de archivos temporales\n4. Optimización de disco duro',
    '- Limpieza profunda de polvo\n- Cambio de pasta térmica en procesador\n- Verificación de temperatura de componentes\n- Ajuste de ventiladores',
    '- Escaneo completo de virus y malware\n- Desfragmentación de disco\n- Actualización de drivers\n- Configuración de actualizaciones automáticas',
    'Equipo presentaba acumulación de polvo moderada. Componentes en buen estado. Temperaturas normales después del mantenimiento.',
    'Sistema operativo actualizado correctamente. Antivirus funcionando. No se detectaron amenazas. Rendimiento mejorado.',
    'Juan Pérez Gómez - Técnico IT Senior',
    'Dra. María García López - Jefe de Enfermería',
    120,
    'Ninguno',
    'Equipo entregado en perfecto estado de funcionamiento. Usuario capacitado en uso básico.',
    '/reportes/2025/11/mtto-hardware-001.pdf',
    '/reportes/2025/11/mtto-software-001.pdf',
    '/reportes/2025/11/acta-entrega-001.pdf',
    1,
    1
);

-- Insertar mantenimiento correctivo
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, hora_llamado, hora_inicio, hora_terminacion,
    tipo_mantenimiento, tipo_falla, mphardware,
    observacionesh, autor_realizado, autor_recibido, tiempo_fuera_servicio,
    dano, entega, rutahardware,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'CORR-SYS-2025-002',
    '2025-11-05',
    '14:00:00',
    '14:15:00',
    '16:00:00',
    'Correctivo',
    'Operación Indebida',
    'Reemplazo de fuente de poder dañada por sobrecarga eléctrica. Instalación de fuente de 650W certificada.',
    'Fuente de poder quemada debido a sobrecarga. Se instaló regulador de voltaje adicional para prevenir futuros incidentes.',
    'Carlos Ramírez Soto - Técnico IT',
    'Lic. Ana Torres Ruiz - Coordinadora Administrativa',
    105,
    'Fuente de poder quemada por sobrecarga eléctrica. Componentes internos revisados sin daños adicionales.',
    'Equipo reparado y funcionando correctamente. Instalado regulador de voltaje.',
    '/reportes/2025/11/reparacion-002.pdf',
    2,
    2
);

-- Insertar mantenimiento predictivo
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, tipo_mantenimiento, tipo_falla,
    mphardware, observacionesh, autor_realizado,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'PRED-SYS-2025-003',
    '2025-11-10',
    'Predictivo',
    'Desgaste',
    'Análisis de temperatura y rendimiento del procesador mediante software especializado.',
    'Temperaturas elevadas detectadas (85°C en carga). Pasta térmica seca. Se recomienda cambio inmediato de pasta térmica y limpieza de disipador en próximos 15 días para evitar daños permanentes.',
    'Roberto Díaz Hernández - Analista de Sistemas',
    3,
    3
);

-- Insertar mantenimiento solo software
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, hora_inicio, hora_terminacion,
    tipo_mantenimiento, tipo_falla, mpsoftware, rutinas,
    observacioness, autor_realizado, tiempo_fuera_servicio,
    rutasoftware, id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'SOFT-SYS-2025-004',
    '2025-11-12',
    '09:00:00',
    '09:30:00',
    'Preventivo',
    'Sin Falla',
    'Instalación de actualizaciones de seguridad críticas de Microsoft (KB5032190, KB5032191)',
    '1. Backup completo del sistema a servidor de respaldos\n2. Instalación de parches de seguridad\n3. Reinicio del sistema\n4. Verificación de funcionamiento post-actualización',
    'Sistema actualizado exitosamente. No se detectaron problemas. Todas las aplicaciones funcionando correctamente.',
    'Laura Mendoza Castro - Especialista en Seguridad IT',
    30,
    '/reportes/2025/11/actualizacion-004.pdf',
    4,
    4
);

-- Insertar otro mantenimiento correctivo
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, hora_llamado, hora_inicio, hora_terminacion,
    tipo_mantenimiento, tipo_falla, mphardware, mpsoftware,
    observacionesh, observacioness, autor_realizado, autor_recibido,
    tiempo_fuera_servicio, dano, entega,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'CORR-SYS-2025-005',
    '2025-11-15',
    '11:30:00',
    '11:45:00',
    '13:15:00',
    'Correctivo',
    'Causa Externa',
    'Reemplazo de disco duro mecánico dañado por SSD de 500GB.',
    'Reinstalación de Windows 10 Pro, instalación de drivers y software médico especializado.',
    'Disco duro con sectores dañados. Se realizó migración de datos recuperables a nuevo SSD.',
    'Sistema operativo instalado desde cero. Configuraciones restauradas desde backup. Software médico reinstalado y verificado.',
    'Pedro López Martínez - Técnico IT',
    'Dr. Luis Fernando Mora - Jefe de Laboratorio',
    90,
    'Disco duro mecánico con sectores defectuosos irrecuperables.',
    'Equipo mejorado con SSD. Rendimiento significativamente superior al anterior.',
    1,
    1
);

-- Insertar mantenimiento preventivo adicional
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, tipo_mantenimiento, tipo_falla,
    mphardware, mpsoftware, autor_realizado, tiempo_fuera_servicio,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'PREV-SYS-2025-006',
    '2025-11-18',
    'Preventivo',
    'Sin Falla',
    'Mantenimiento preventivo mensual: limpieza, verificación de componentes.',
    'Actualización de software y escaneo de seguridad.',
    'Andrea Morales Ruiz - Técnico IT Junior',
    45,
    5,
    2
);

-- Insertar mantenimiento con tipo "Otro"
INSERT INTO sysmantenimiento (
    numero_reporte, fecha, tipo_mantenimiento, tipo_falla,
    mpsoftware, observacioness, autor_realizado,
    id_sysequipo_fk, id_sysusuario_fk
) VALUES (
    'OTR-SYS-2025-007',
    '2025-11-20',
    'Otro',
    'No Registra',
    'Configuración de VPN para acceso remoto y configuración de políticas de seguridad.',
    'VPN configurada correctamente. Usuario capacitado en uso de acceso remoto seguro.',
    'Miguel Ángel Pérez - Administrador de Redes',
    2,
    3
);

-- Insertar algunos repuestos de ejemplo
INSERT INTO sysrepuestos (
    nombre_equipo, marca, modelo, serie, ubicacion, observaciones, activo, id_sys_equipo_fk
) VALUES
('Memoria RAM DDR4 8GB', 'Kingston', 'KVR26N19S8/8', 'SR789456', 'Almacén IT - Estante A3', 'Nuevo - En stock', 1, 1),
('Disco Duro SSD 500GB', 'Samsung', '870 EVO', 'S5GUNG0R123456', 'Almacén IT - Estante B2', 'Nuevo - En stock', 1, 1),
('Fuente de Poder 650W', 'Corsair', 'CV650', 'CV650-2021-123', 'Almacén IT - Estante C1', 'Nuevo - Certificada 80+ Bronze', 1, 2),
('Teclado USB', 'Logitech', 'K120', 'K120-456789', 'Almacén IT - Estante D4', 'Usado - Funcional', 1, 3),
('Mouse Óptico USB', 'HP', 'X500', 'X500-789123', 'Almacén IT - Estante D4', 'Nuevo - En stock', 1, 4);

-- ========================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ========================================

SELECT
    'Mantenimientos insertados' as tabla,
    COUNT(*) as total
FROM sysmantenimiento

UNION ALL

SELECT
    'Repuestos insertados' as tabla,
    COUNT(*) as total
FROM sysrepuestos;

-- Ver resumen de mantenimientos por tipo
SELECT
    tipo_mantenimiento,
    COUNT(*) as cantidad
FROM sysmantenimiento
GROUP BY tipo_mantenimiento
ORDER BY cantidad DESC;

-- Ver resumen de mantenimientos por tipo de falla
SELECT
    tipo_falla,
    COUNT(*) as cantidad
FROM sysmantenimiento
GROUP BY tipo_falla
ORDER BY cantidad DESC;

SELECT '¡Datos de prueba insertados exitosamente!' as mensaje;

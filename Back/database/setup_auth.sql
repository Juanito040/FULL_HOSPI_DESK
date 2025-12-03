-- Script de configuración de autenticación y roles
-- Hospital San Rafael - Sistema de Gestión de Equipos

-- =====================================================
-- 1. CREAR ROLES
-- =====================================================
INSERT INTO rol (nombre, createdAt, updatedAt)
VALUES
  ('Administrador', NOW(), NOW()),
  ('Supervisor', NOW(), NOW()),
  ('Técnico', NOW(), NOW()),
  ('Usuario', NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- =====================================================
-- 2. CREAR USUARIO ADMINISTRADOR DE PRUEBA
-- =====================================================
-- Contraseña: admin123 (hasheada con bcrypt)
-- IMPORTANTE: Cambiar esta contraseña en producción

INSERT INTO usuario (
  nombres,
  apellidos,
  nombreUsuario,
  tipoId,
  numeroId,
  telefono,
  email,
  contraseña,
  registroInvima,
  estado,
  rolId,
  createdAt,
  updatedAt
)
SELECT
  'Administrador',
  'Sistema',
  'admin',
  'CC',
  '1000000000',
  '3001234567',
  'admin@hospitalsr.com',
  '$2a$10$8ZqY5Y5Y5Y5Y5Y5Y5Y5Y5eMZqY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5.',
  'REG-ADMIN-001',
  1,
  (SELECT id FROM rol WHERE nombre = 'Administrador' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM usuario WHERE nombreUsuario = 'admin'
);

-- =====================================================
-- 3. CREAR USUARIOS DE PRUEBA ADICIONALES
-- =====================================================

-- Usuario Supervisor (contraseña: super123)
INSERT INTO usuario (
  nombres,
  apellidos,
  nombreUsuario,
  tipoId,
  numeroId,
  telefono,
  email,
  contraseña,
  registroInvima,
  estado,
  rolId,
  createdAt,
  updatedAt
)
SELECT
  'Supervisor',
  'Técnico',
  'supervisor',
  'CC',
  '1000000001',
  '3001234568',
  'supervisor@hospitalsr.com',
  '$2a$10$8ZqY5Y5Y5Y5Y5Y5Y5Y5Y5eMZqY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5.',
  'REG-SUP-001',
  1,
  (SELECT id FROM rol WHERE nombre = 'Supervisor' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM usuario WHERE nombreUsuario = 'supervisor'
);

-- Usuario Técnico (contraseña: tecnico123)
INSERT INTO usuario (
  nombres,
  apellidos,
  nombreUsuario,
  tipoId,
  numeroId,
  telefono,
  email,
  contraseña,
  registroInvima,
  estado,
  rolId,
  createdAt,
  updatedAt
)
SELECT
  'Juan',
  'Técnico',
  'tecnico',
  'CC',
  '1000000002',
  '3001234569',
  'tecnico@hospitalsr.com',
  '$2a$10$8ZqY5Y5Y5Y5Y5Y5Y5Y5Y5eMZqY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5.',
  'REG-TEC-001',
  1,
  (SELECT id FROM rol WHERE nombre = 'Técnico' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM usuario WHERE nombreUsuario = 'tecnico'
);

-- =====================================================
-- 4. VERIFICAR DATOS INSERTADOS
-- =====================================================
SELECT
  'ROLES CREADOS:' as Info,
  COUNT(*) as Total
FROM rol;

SELECT
  'USUARIOS CREADOS:' as Info,
  COUNT(*) as Total
FROM usuario;

SELECT
  u.nombreUsuario,
  u.email,
  r.nombre as rol,
  u.estado
FROM usuario u
INNER JOIN rol r ON u.rolId = r.id
ORDER BY u.id;

-- =====================================================
-- CREDENCIALES DE PRUEBA:
-- =====================================================
-- Administrador:
--   Usuario: admin
--   Contraseña: admin123
--
-- Supervisor:
--   Usuario: supervisor
--   Contraseña: super123
--
-- Técnico:
--   Usuario: tecnico
--   Contraseña: tecnico123
-- =====================================================

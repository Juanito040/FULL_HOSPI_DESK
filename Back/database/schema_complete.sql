

CREATE DATABASE IF NOT EXISTS db_hospi;
USE db_hospi;

-- ================================================
-- Tabla: authorities
-- ================================================
DROP TABLE IF EXISTS `authorities`;
CREATE TABLE `authorities` (
  `id_authority` int(11) NOT NULL AUTO_INCREMENT,
  `authority` varchar(255) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_authority`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `authorities_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: datostecnicos
-- ================================================
DROP TABLE IF EXISTS `datostecnicos`;
CREATE TABLE `datostecnicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vMaxOperacion` varchar(255) DEFAULT '0',
  `vMinOperacion` varchar(255) DEFAULT '0',
  `iMaxOperacion` varchar(255) DEFAULT '0',
  `iMinOperacion` varchar(255) DEFAULT '0',
  `wConsumida` varchar(255) DEFAULT '0',
  `frecuencia` varchar(255) DEFAULT '0',
  `presion` varchar(255) DEFAULT '0',
  `velocidad` varchar(255) DEFAULT '0',
  `temperatura` varchar(255) DEFAULT '0',
  `peso` varchar(255) DEFAULT '0',
  `capacidad` varchar(255) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: documento
-- ================================================
DROP TABLE IF EXISTS `documento`;
CREATE TABLE `documento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `equipoIdFk` int(11) NOT NULL,
  `tipoDocumntoIdFk` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `documento_equipo_id_fk` (`equipoIdFk`),
  KEY `documento_tipo_documnto_id_fk` (`tipoDocumntoIdFk`),
  CONSTRAINT `documento_ibfk_1` FOREIGN KEY (`equipoIdFk`) REFERENCES `equipo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documento_ibfk_2` FOREIGN KEY (`tipoDocumntoIdFk`) REFERENCES `tipodocumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: equipo
-- ================================================
DROP TABLE IF EXISTS `equipo`;
CREATE TABLE `equipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `serie` varchar(255) NOT NULL,
  `placa` varchar(255) NOT NULL,
  `registroInvima` varchar(255) DEFAULT NULL,
  `riesgo` enum('NA','I','IIA','IIB','III') DEFAULT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `ubicacionEspecifica` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `periodicidadM` int(11) NOT NULL DEFAULT 1,
  `periodicidadC` int(11) NOT NULL DEFAULT 1,
  `estadoBaja` tinyint(4) NOT NULL DEFAULT 0,
  `calibracion` tinyint(4) NOT NULL DEFAULT 0,
  `calificacion` tinyint(4) NOT NULL DEFAULT 0,
  `validacion` tinyint(4) NOT NULL DEFAULT 0,
  `tipoEquipoIdFk` int(11) NOT NULL,
  `servicioIdFk` int(11) NOT NULL,
  `sedeIdFk` int(11) NOT NULL,
  `responsableIdFk` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `equipo_tipo_equipo_id_fk` (`tipoEquipoIdFk`),
  KEY `equipo_servicio_id_fk` (`servicioIdFk`),
  KEY `equipo_sede_id_fk` (`sedeIdFk`),
  KEY `equipo_responsable_id_fk` (`responsableIdFk`),
  CONSTRAINT `equipo_ibfk_1` FOREIGN KEY (`tipoEquipoIdFk`) REFERENCES `tipoequipo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipo_ibfk_2` FOREIGN KEY (`servicioIdFk`) REFERENCES `servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipo_ibfk_3` FOREIGN KEY (`sedeIdFk`) REFERENCES `sede` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `equipo_ibfk_4` FOREIGN KEY (`responsableIdFk`) REFERENCES `responsable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: fabricante
-- ================================================
DROP TABLE IF EXISTS `fabricante`;
CREATE TABLE `fabricante` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: hojavida
-- ================================================
DROP TABLE IF EXISTS `hojavida`;
CREATE TABLE `hojavida` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigoInternacional` varchar(255) DEFAULT NULL,
  `anoIngreso` int(11) DEFAULT NULL,
  `contrato` varchar(255) DEFAULT NULL,
  `tipoAdquisicion` enum('Compra','Convenio','Donación','Comodato','Alquiler','NR') DEFAULT NULL,
  `fechaCompra` datetime DEFAULT NULL,
  `fechaInstalacion` datetime DEFAULT NULL,
  `fechaIncorporacion` datetime DEFAULT NULL,
  `fechaVencimientoGarantia` datetime DEFAULT NULL,
  `costoCompra` int(11) DEFAULT NULL,
  `fuente` enum('Electricidad','Energia Solar','Agua','Gas','Vapor de agua','Derivados del petroleo','Otra') DEFAULT NULL,
  `tipoUso` enum('Diagnostico','Terapéutico','Soporte Vital','Quirúrgico','Equipo de laboratorio','Rehabilitación','Gestión y Soporte Hospitalario','NR') DEFAULT NULL,
  `clase` enum('Electrico','Electronico','Mecanico','Electromecanico','Hidraulico','Neumatico','Vapor','Solar','Otro') DEFAULT NULL,
  `mantenimiento` enum('Propio','Contratado','Comodato','Garantia') DEFAULT NULL,
  `propiedad` enum('Hospital','Proveedor','otro') DEFAULT NULL,
  `equipoPortatil` tinyint(4) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT '',
  `datosTecnicosIdFk` int(11) DEFAULT NULL,
  `equipoIdFk` int(11) DEFAULT NULL,
  `fabricanteIdFk` int(11) DEFAULT NULL,
  `proveedorIdFk` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hojavida_datos_tecnicos_id_fk` (`datosTecnicosIdFk`),
  KEY `hojavida_equipo_id_fk` (`equipoIdFk`),
  KEY `hojavida_fabricante_id_fk` (`fabricanteIdFk`),
  KEY `hojavida_proveedor_id_fk` (`proveedorIdFk`),
  CONSTRAINT `hojavida_ibfk_1` FOREIGN KEY (`datosTecnicosIdFk`) REFERENCES `datostecnicos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hojavida_ibfk_2` FOREIGN KEY (`equipoIdFk`) REFERENCES `equipo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hojavida_ibfk_3` FOREIGN KEY (`fabricanteIdFk`) REFERENCES `fabricante` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hojavida_ibfk_4` FOREIGN KEY (`proveedorIdFk`) REFERENCES `proveedor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: hospital
-- ================================================
DROP TABLE IF EXISTS `hospital`;
CREATE TABLE `hospital` (
  `id_hospital` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_hospital` varchar(255) NOT NULL,
  `direccion_hospital` varchar(255) NOT NULL,
  `nit_hospital` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `departamento` varchar(255) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `nivel` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_hospital`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: licencia
-- ================================================
DROP TABLE IF EXISTS `licencia`;
CREATE TABLE `licencia` (
  `id_licencia` int(11) NOT NULL AUTO_INCREMENT,
  `resolucion` varchar(255) NOT NULL,
  `rutaformato` varchar(255) DEFAULT NULL,
  `id_hospital_fk` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_licencia`),
  KEY `id_hospital_fk` (`id_hospital_fk`),
  CONSTRAINT `licencia_ibfk_1` FOREIGN KEY (`id_hospital_fk`) REFERENCES `hospital` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: pacientes
-- ================================================
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F','Otro') NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documento` (`documento`),
  KEY `pacientes_documento` (`documento`),
  KEY `pacientes_nombre` (`nombre`),
  KEY `pacientes_apellido` (`apellido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: proveedor
-- ================================================
DROP TABLE IF EXISTS `proveedor`;
CREATE TABLE `proveedor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `representante` varchar(255) DEFAULT NULL,
  `telRepresentante` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: responsable
-- ================================================
DROP TABLE IF EXISTS `responsable`;
CREATE TABLE `responsable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `garantia` tinyint(4) NOT NULL DEFAULT 0,
  `externo` tinyint(4) NOT NULL DEFAULT 0,
  `calificacion` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: rol
-- ================================================
DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: sede
-- ================================================
DROP TABLE IF EXISTS `sede`;
CREATE TABLE `sede` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `nit` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `departamento` varchar(255) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `nivel` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: servicio
-- ================================================
DROP TABLE IF EXISTS `servicio`;
CREATE TABLE `servicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: sysequipo
-- ================================================
DROP TABLE IF EXISTS `sysequipo`;
CREATE TABLE `sysequipo` (
  `id_sysequipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_equipo` varchar(255) NOT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `modelo` varchar(255) DEFAULT NULL,
  `serie` varchar(255) DEFAULT NULL,
  `placa_inventario` varchar(255) DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `ubicacion_especifica` varchar(255) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `ano_ingreso` int(11) DEFAULT NULL,
  `dias_mantenimiento` int(11) DEFAULT NULL,
  `periodicidad` int(11) DEFAULT NULL,
  `estado_baja` tinyint(4) NOT NULL DEFAULT 0,
  `administrable` tinyint(4) NOT NULL DEFAULT 0,
  `direccionamiento_Vlan` varchar(255) DEFAULT NULL,
  `numero_puertos` int(11) DEFAULT NULL,
  `mtto` tinyint(4) NOT NULL DEFAULT 1,
  `id_hospital_fk` int(11) DEFAULT NULL,
  `id_servicio_fk` int(11) DEFAULT NULL,
  `id_tipo_equipo_fk` int(11) DEFAULT NULL,
  `id_usuario_fk` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_sysequipo`),
  KEY `id_hospital_fk` (`id_hospital_fk`),
  KEY `id_tipo_equipo_fk` (`id_tipo_equipo_fk`),
  KEY `id_usuario_fk` (`id_usuario_fk`),
  KEY `sysequipo_id_servicio_fk` (`id_servicio_fk`),
  KEY `sysequipo_activo` (`activo`),
  CONSTRAINT `sysequipo_ibfk_1` FOREIGN KEY (`id_hospital_fk`) REFERENCES `hospital` (`id_hospital`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sysequipo_ibfk_2` FOREIGN KEY (`id_servicio_fk`) REFERENCES `servicio` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sysequipo_ibfk_3` FOREIGN KEY (`id_tipo_equipo_fk`) REFERENCES `tipoequipo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sysequipo_ibfk_4` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: tipodocumento
-- ================================================
DROP TABLE IF EXISTS `tipodocumento`;
CREATE TABLE `tipodocumento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: tipoequipo
-- ================================================
DROP TABLE IF EXISTS `tipoequipo`;
CREATE TABLE `tipoequipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `materialConsumible` varchar(255) NOT NULL,
  `herramienta` varchar(255) NOT NULL,
  `tiempoMinutos` varchar(255) NOT NULL,
  `repuestosMinimos` varchar(255) NOT NULL,
  `tipoR` int(11) NOT NULL DEFAULT 0,
  `actividad` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: user_authority
-- ================================================
DROP TABLE IF EXISTS `user_authority`;
CREATE TABLE `user_authority` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_fk` int(11) NOT NULL,
  `authority_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_authority_id_usuario_fk_authority_id` (`id_usuario_fk`,`authority_id`),
  KEY `authority_id` (`authority_id`),
  CONSTRAINT `user_authority_ibfk_1` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_authority_ibfk_2` FOREIGN KEY (`authority_id`) REFERENCES `authorities` (`id_authority`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: usuario
-- ================================================
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `nombreUsuario` varchar(255) NOT NULL,
  `tipoId` varchar(255) NOT NULL,
  `numeroId` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `registroInvima` varchar(255) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `rolId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombreUsuario` (`nombreUsuario`),
  UNIQUE KEY `email` (`email`),
  KEY `rolId` (`rolId`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rolId`) REFERENCES `rol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


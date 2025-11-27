
-- Usar la base de datos
USE db_hospi;

-- ========================================
-- PASO 2: TABLAS BASE EXISTENTES
-- ========================================

-- Tabla datostecnicos
CREATE TABLE IF NOT EXISTS datostecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vMaxOperacion VARCHAR(255) DEFAULT '0' NULL,
    vMinOperacion VARCHAR(255) DEFAULT '0' NULL,
    iMaxOperacion VARCHAR(255) DEFAULT '0' NULL,
    iMinOperacion VARCHAR(255) DEFAULT '0' NULL,
    wConsumida VARCHAR(255) DEFAULT '0' NULL,
    frecuencia VARCHAR(255) DEFAULT '0' NULL,
    presion VARCHAR(255) DEFAULT '0' NULL,
    velocidad VARCHAR(255) DEFAULT '0' NULL,
    temperatura VARCHAR(255) DEFAULT '0' NULL,
    peso VARCHAR(255) DEFAULT '0' NULL,
    capacidad VARCHAR(255) DEFAULT '0' NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla fabricante
CREATE TABLE IF NOT EXISTS fabricante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NULL,
    pais VARCHAR(255) NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla proveedor
CREATE TABLE IF NOT EXISTS proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NULL,
    telefono VARCHAR(255) NULL,
    correo VARCHAR(255) NULL,
    ciudad VARCHAR(255) NULL,
    representante VARCHAR(255) NULL,
    telRepresentante VARCHAR(255) NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla responsable
CREATE TABLE IF NOT EXISTS responsable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    garantia TINYINT(1) NOT NULL DEFAULT 0,
    externo TINYINT(1) NOT NULL DEFAULT 0,
    calificacion INT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla rol
CREATE TABLE IF NOT EXISTS rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT nombre UNIQUE (nombre)
);

-- Tabla sede
CREATE TABLE IF NOT EXISTS sede (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    nit VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    departamento VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    nivel INT NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla servicio
CREATE TABLE IF NOT EXISTS servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla tipodocumento
CREATE TABLE IF NOT EXISTS tipodocumento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla tipoequipo
CREATE TABLE IF NOT EXISTS tipoequipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    materialConsumible VARCHAR(255) NOT NULL,
    herramienta VARCHAR(255) NOT NULL,
    tiempoMinutos VARCHAR(255) NOT NULL,
    repuestosMinimos VARCHAR(255) NOT NULL,
    tipoR INT NOT NULL DEFAULT 0,
    actividad VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    nombreUsuario VARCHAR(255) NOT NULL,
    tipoId VARCHAR(255) NOT NULL,
    numeroId VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    registroInvima VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    rolId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT email UNIQUE (email),
    CONSTRAINT nombreUsuario UNIQUE (nombreUsuario),
    CONSTRAINT usuario_ibfk_1
        FOREIGN KEY (rolId) REFERENCES rol(id)
        ON UPDATE CASCADE
);

-- ========================================
-- PASO 3: TABLAS COMPARTIDAS NUEVAS
-- ========================================

-- Tabla hospital
CREATE TABLE IF NOT EXISTS hospital (
    id_hospital INT AUTO_INCREMENT PRIMARY KEY,
    nombre_hospital VARCHAR(255) NOT NULL,
    direccion_hospital VARCHAR(255) NOT NULL,
    nit_hospital VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    departamento VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    nivel INT NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla authorities
CREATE TABLE IF NOT EXISTS authorities (
    id_authority INT AUTO_INCREMENT PRIMARY KEY,
    authority VARCHAR(255) NOT NULL,
    id_usuario INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_authorities_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla user_authority
CREATE TABLE IF NOT EXISTS user_authority (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_fk INT NOT NULL,
    authority_id INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_authority_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_user_authority_authority
        FOREIGN KEY (authority_id) REFERENCES authorities(id_authority)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY unique_user_authority (id_usuario_fk, authority_id)
);

-- Tabla licencia
CREATE TABLE IF NOT EXISTS licencia (
    id_licencia INT AUTO_INCREMENT PRIMARY KEY,
    resolucion VARCHAR(255) NOT NULL,
    rutaformato VARCHAR(255) NULL,
    id_hospital_fk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_licencia_hospital
        FOREIGN KEY (id_hospital_fk) REFERENCES hospital(id_hospital)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================
-- PASO 4: TABLAS DE EQUIPOS BIOMÉDICOS
-- ========================================

-- Tabla equipo
CREATE TABLE IF NOT EXISTS equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    serie VARCHAR(255) NOT NULL,
    placa VARCHAR(255) NOT NULL,
    registroInvima VARCHAR(255) NULL,
    riesgo ENUM('NA', 'I', 'IIA', 'IIB', 'III') NULL,
    ubicacion VARCHAR(255) NOT NULL,
    ubicacionEspecifica VARCHAR(255) NOT NULL,
    activo TINYINT(1) DEFAULT 1 NOT NULL,
    periodicidadM INT DEFAULT 1 NOT NULL,
    periodicidadC INT DEFAULT 1 NOT NULL,
    estadoBaja TINYINT(1) DEFAULT 0 NOT NULL,
    calibracion TINYINT(1) DEFAULT 0 NOT NULL,
    calificacion TINYINT(1) DEFAULT 0 NOT NULL,
    validacion TINYINT(1) DEFAULT 0 NOT NULL,
    tipoEquipoIdFk INT NOT NULL,
    servicioIdFk INT NOT NULL,
    sedeIdFk INT NOT NULL,
    responsableIdFk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT equipo_ibfk_1
        FOREIGN KEY (tipoEquipoIdFk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE,
    CONSTRAINT equipo_ibfk_2
        FOREIGN KEY (servicioIdFk) REFERENCES servicio(id)
        ON UPDATE CASCADE,
    CONSTRAINT equipo_ibfk_3
        FOREIGN KEY (sedeIdFk) REFERENCES sede(id)
        ON UPDATE CASCADE,
    CONSTRAINT equipo_ibfk_4
        FOREIGN KEY (responsableIdFk) REFERENCES responsable(id)
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS tipoEquipoIdFk ON equipo(tipoEquipoIdFk);
CREATE INDEX IF NOT EXISTS servicioIdFk ON equipo(servicioIdFk);
CREATE INDEX IF NOT EXISTS sedeIdFk ON equipo(sedeIdFk);
CREATE INDEX IF NOT EXISTS responsableIdFk ON equipo(responsableIdFk);

-- Tabla documento
CREATE TABLE IF NOT EXISTS documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    equipoIdFk INT NOT NULL,
    tipoDocumntoIdFk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT documento_ibfk_1
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT documento_ibfk_2
        FOREIGN KEY (tipoDocumntoIdFk) REFERENCES tipodocumento(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS equipoIdFk ON documento(equipoIdFk);
CREATE INDEX IF NOT EXISTS tipoDocumntoIdFk ON documento(tipoDocumntoIdFk);

-- Tabla hojavida
CREATE TABLE IF NOT EXISTS hojavida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigoInternacional VARCHAR(255) NULL,
    anoIngreso INT NULL,
    contrato VARCHAR(255) NULL,
    tipoAdquisicion ENUM('Compra', 'Convenio', 'Donación', 'Comodato', 'Alquiler', 'NR') NULL,
    fechaCompra DATETIME NULL,
    fechaInstalacion DATETIME NULL,
    fechaIncorporacion DATETIME NULL,
    fechaVencimientoGarantia DATETIME NULL,
    costoCompra INT NULL,
    fuente ENUM('Electricidad', 'Energia Solar', 'Agua', 'Gas', 'Vapor de agua', 'Derivados del petroleo', 'Otra') NULL,
    tipoUso ENUM('Diagnostico', 'Terapéutico', 'Soporte Vital', 'Quirúrgico', 'Equipo de laboratorio', 'Rehabilitación', 'Gestión y Soporte Hospitalario', 'NR') NULL,
    clase ENUM('Electrico', 'Electronico', 'Mecanico', 'Electromecanico', 'Hidraulico', 'Neumatico', 'Vapor', 'Solar', 'Otro') NULL,
    mantenimiento ENUM('Propio', 'Contratado', 'Comodato', 'Garantia') NULL,
    propiedad ENUM('Hospital', 'Proveedor', 'otro') NULL,
    equipoPortatil TINYINT(1) NULL,
    foto VARCHAR(255) NULL,
    observaciones VARCHAR(255) DEFAULT '' NULL,
    datosTecnicosIdFk INT NULL,
    equipoIdFk INT NULL,
    fabricanteIdFk INT NULL,
    proveedorIdFk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT hojavida_ibfk_1
        FOREIGN KEY (datosTecnicosIdFk) REFERENCES datostecnicos(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT hojavida_ibfk_2
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT hojavida_ibfk_3
        FOREIGN KEY (fabricanteIdFk) REFERENCES fabricante(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT hojavida_ibfk_4
        FOREIGN KEY (proveedorIdFk) REFERENCES proveedor(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS datosTecnicosIdFk ON hojavida(datosTecnicosIdFk);
CREATE INDEX IF NOT EXISTS equipoIdFk_hv ON hojavida(equipoIdFk);
CREATE INDEX IF NOT EXISTS fabricanteIdFk ON hojavida(fabricanteIdFk);
CREATE INDEX IF NOT EXISTS proveedorIdFk ON hojavida(proveedorIdFk);

-- Tabla hoja_vida_otros
CREATE TABLE IF NOT EXISTS hoja_vida_otros (
    id_hoja_vida_otros INT AUTO_INCREMENT PRIMARY KEY,
    serie_otros VARCHAR(255) NULL,
    nombre_equipo_otros VARCHAR(255) NOT NULL,
    marca_otros VARCHAR(255) NULL,
    modelo_otros VARCHAR(255) NULL,
    ano_fabricacion_otros INT NULL,
    placa_inventario_otros VARCHAR(255) NULL,
    fecha_compra_otros DATETIME NULL,
    fecha_instalacion_otros DATETIME NULL,
    costo_compra_otros INT NULL,
    fabricante_otros VARCHAR(255) NULL,
    proveedor_otros VARCHAR(255) NULL,
    equipotipofijo_otros TINYINT(1) DEFAULT 1,
    equipotipoportatil_otros TINYINT(1) DEFAULT 0,
    usomedico_otros TINYINT(1) DEFAULT 0,
    usobasico_otros TINYINT(1) DEFAULT 0,
    usoapoyo_otros TINYINT(1) DEFAULT 0,
    riesgoi_otros TINYINT(1) DEFAULT 0,
    riesgoiia_otros TINYINT(1) DEFAULT 0,
    riesgoiib_otros TINYINT(1) DEFAULT 0,
    riesgoiii_otros TINYINT(1) DEFAULT 0,
    riesgona_otros TINYINT(1) DEFAULT 0,
    foto_otros VARCHAR(255) NULL,
    id_equipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hoja_vida_otros_equipo
        FOREIGN KEY (id_equipo_fk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla hoja_vida_comodatos
CREATE TABLE IF NOT EXISTS hoja_vida_comodatos (
    id_hoja_vida_comodatos INT AUTO_INCREMENT PRIMARY KEY,
    serie_comodatos VARCHAR(255) NULL,
    nombre_equipo_comodatos VARCHAR(255) NOT NULL,
    marca_comodatos VARCHAR(255) NULL,
    modelo_comodatos VARCHAR(255) NULL,
    ano_fabricacion_comodatos INT NULL,
    placa_inventario_comodatos VARCHAR(255) NULL,
    fecha_compra_comodatos DATETIME NULL,
    fecha_instalacion_comodatos DATETIME NULL,
    costo_compra_comodatos INT NULL,
    fabricante_comodatos VARCHAR(255) NULL,
    proveedor_comodatos VARCHAR(255) NULL,
    equipotipofijo_comodatos TINYINT(1) DEFAULT 1,
    equipotipoportatil_comodatos TINYINT(1) DEFAULT 0,
    comodato_activo TINYINT(1) DEFAULT 1,
    id_equipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hoja_vida_comodatos_equipo
        FOREIGN KEY (id_equipo_fk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================
-- PASO 5: TABLAS DE PLANIFICACIÓN Y MANTENIMIENTO
-- ========================================

-- Tabla planactividadmetrologica
CREATE TABLE IF NOT EXISTS planactividadmetrologica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipoIdFk INT NOT NULL,
    mes INT NOT NULL,
    ano INT NOT NULL,
    tipoActividad ENUM('Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica') NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT planactividadmetrologica_ibfk_1
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS equipoIdFk_pam ON planactividadmetrologica(equipoIdFk);

-- Tabla planmantenimiento
CREATE TABLE IF NOT EXISTS planmantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipoIdFk INT NOT NULL,
    mes INT NOT NULL,
    ano INT NOT NULL,
    rangoInicio INT NOT NULL,
    rangoFin INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT planmantenimiento_ibfk_1
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS equipoIdFk_pm ON planmantenimiento(equipoIdFk);

-- Tabla protocolopreventivo
CREATE TABLE IF NOT EXISTS protocolopreventivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paso TEXT NOT NULL,
    tipoEquipoIdFk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT protocolopreventivo_ibfk_1
        FOREIGN KEY (tipoEquipoIdFk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS tipoEquipoIdFk_pp ON protocolopreventivo(tipoEquipoIdFk);

-- Tabla actividadmetrologica
CREATE TABLE IF NOT EXISTS actividadmetrologica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoActividad ENUM('Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica') NOT NULL,
    mesProgramado INT NOT NULL,
    añoProgramado INT NOT NULL,
    fechaRealizado DATETIME NULL,
    empresa VARCHAR(255) NULL,
    errorMaximoIdentificado DOUBLE NULL,
    observaciones VARCHAR(255) NULL,
    resultado ENUM('Cumple', 'No Cumple', 'No Aplica') NULL,
    realizado TINYINT(1) NOT NULL DEFAULT 0,
    rutaReporte VARCHAR(255) NULL,
    usuarioIdFk INT NULL,
    equipoIdFk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT actividadmetrologica_ibfk_1
        FOREIGN KEY (usuarioIdFk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT actividadmetrologica_ibfk_2
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS equipoIdFk_am ON actividadmetrologica(equipoIdFk);
CREATE INDEX IF NOT EXISTS usuarioIdFk_am ON actividadmetrologica(usuarioIdFk);

-- Tabla mantenimiento_preventivo
CREATE TABLE IF NOT EXISTS mantenimiento_preventivo (
    id_mantenimiento_preventivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    placa_inventario VARCHAR(255) NULL,
    servicio VARCHAR(255) NULL,
    ubicacion VARCHAR(255) NULL,
    fecha_realizacion DATE NULL,
    dias INT NULL,
    mes INT NULL,
    ano INT NULL,
    tiempo_realizacion TIME NULL,
    realizado TINYINT(1) DEFAULT 0,
    checkcode VARCHAR(255) NULL,
    id_equipo_fk INT NULL,
    id_tipo_equipo_fk INT NULL,
    id_usuario_fk INT NULL,
    id_reporte_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mantenimiento_preventivo_equipo
        FOREIGN KEY (id_equipo_fk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_mantenimiento_preventivo_tipo_equipo
        FOREIGN KEY (id_tipo_equipo_fk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_mantenimiento_preventivo_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla fecha_mantenimiento_equipo
CREATE TABLE IF NOT EXISTS fecha_mantenimiento_equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia1 INT NULL,
    dia2 INT NULL,
    mes INT NOT NULL,
    año INT NOT NULL,
    debe_realizar TINYINT(1) DEFAULT 1,
    id_equipo_fk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fecha_mantenimiento_equipo
        FOREIGN KEY (id_equipo_fk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================
-- PASO 6: TABLAS DE REPORTES
-- ========================================

-- Tabla reporte
CREATE TABLE IF NOT EXISTS reporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    añoProgramado INT NULL,
    mesProgramado INT NULL,
    fechaRealizado DATE NULL,
    horaInicio TIME NULL,
    fechaFin DATE NULL,
    horaTerminacion TIME NULL,
    horaTotal TIME NULL,
    tipoMantenimiento ENUM('Correctivo', 'Preventivo', 'Predictivo', 'Otro') NULL,
    tipoFalla ENUM('Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra') NULL,
    motivo TEXT NULL,
    trabajoRealizado VARCHAR(255) NULL,
    calificacion INT NULL,
    nombreRecibio VARCHAR(255) NULL,
    cedulaRecibio VARCHAR(255) NULL,
    observaciones TEXT NULL,
    mantenimientoPropio TINYINT(1) NULL,
    realizado TINYINT(1) NULL,
    rutaPdf TEXT NULL,
    servicioIdFk INT NOT NULL,
    equipoIdFk INT NOT NULL,
    usuarioIdFk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT reporte_ibfk_1
        FOREIGN KEY (servicioIdFk) REFERENCES servicio(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT reporte_ibfk_2
        FOREIGN KEY (equipoIdFk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT reporte_ibfk_3
        FOREIGN KEY (usuarioIdFk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS equipoIdFk_rep ON reporte(equipoIdFk);
CREATE INDEX IF NOT EXISTS servicioIdFk_rep ON reporte(servicioIdFk);
CREATE INDEX IF NOT EXISTS usuarioIdFk_rep ON reporte(usuarioIdFk);

-- Tabla cumpliminetoprotocolopreventivo
CREATE TABLE IF NOT EXISTS cumpliminetoprotocolopreventivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cumple DOUBLE NOT NULL,
    protocoloPreventivoIdFk INT NOT NULL,
    reporteIdFk INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT cumpliminetoprotocolopreventivo_ibfk_1
        FOREIGN KEY (protocoloPreventivoIdFk) REFERENCES protocolopreventivo(id)
        ON UPDATE CASCADE,
    CONSTRAINT cumpliminetoprotocolopreventivo_ibfk_2
        FOREIGN KEY (reporteIdFk) REFERENCES reporte(id)
);

CREATE INDEX IF NOT EXISTS protocoloPreventivoIdFk ON cumpliminetoprotocolopreventivo(protocoloPreventivoIdFk);
CREATE INDEX IF NOT EXISTS reporteIdFk ON cumpliminetoprotocolopreventivo(reporteIdFk);

-- Agregar FK a mantenimiento_preventivo después de crear reporte
ALTER TABLE mantenimiento_preventivo
ADD CONSTRAINT fk_mantenimiento_preventivo_reporte
    FOREIGN KEY (id_reporte_fk) REFERENCES reporte(id)
    ON UPDATE CASCADE ON DELETE SET NULL;

-- ========================================
-- PASO 7: TABLAS DE BAJAS
-- ========================================

-- Tabla baja
CREATE TABLE IF NOT EXISTS baja (
    id_baja INT AUTO_INCREMENT PRIMARY KEY,
    nombre_baja VARCHAR(255) NOT NULL,
    marca_baja VARCHAR(255) NULL,
    modelo_baja VARCHAR(255) NULL,
    serie_baja VARCHAR(255) NULL,
    placa_inventario_baja VARCHAR(255) NULL,
    servicio_baja VARCHAR(255) NULL,
    ubicacion_baja VARCHAR(255) NULL,
    ubicacion_especifica_baja VARCHAR(255) NULL,
    ano_ingreso_baja INT NULL,
    codigo VARCHAR(255) NULL,
    causa TEXT NULL,
    guia VARCHAR(255) NULL,
    id_hospital_fk INT NULL,
    id_hoja_vida_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_baja_hospital
        FOREIGN KEY (id_hospital_fk) REFERENCES hospital(id_hospital)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_baja_hojavida
        FOREIGN KEY (id_hoja_vida_fk) REFERENCES hojavida(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla reporte_baja
CREATE TABLE IF NOT EXISTS reporte_baja (
    id_reporte_baja INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo_baja VARCHAR(255) NOT NULL,
    numero_reporte_baja VARCHAR(255) NULL,
    marca_baja VARCHAR(255) NULL,
    modelo_baja VARCHAR(255) NULL,
    serie_baja VARCHAR(255) NULL,
    placa_inventario_baja VARCHAR(255) NULL,
    servicio_baja VARCHAR(255) NULL,
    ubicacion_baja VARCHAR(255) NULL,
    fecha_baja DATE NULL,
    hora_llamado_baja TIME NULL,
    hora_inicio_baja TIME NULL,
    hora_terminacion_baja TIME NULL,
    tipo_mantenimiento_baja ENUM('Correctivo', 'Preventivo', 'Predictivo', 'Otro') NULL,
    tipo_falla_baja ENUM('Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra') NULL,
    trabajo_realizado_baja VARCHAR(255) NULL,
    autor_realizado_baja VARCHAR(255) NULL,
    autor_recibido_baja VARCHAR(255) NULL,
    motivo_baja TEXT NULL,
    rutapdf_baja TEXT NULL,
    id_baja_fk INT NULL,
    id_mantenimiento_preventivo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reporte_baja_baja
        FOREIGN KEY (id_baja_fk) REFERENCES baja(id_baja)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_reporte_baja_mantenimiento
        FOREIGN KEY (id_mantenimiento_preventivo_fk) REFERENCES mantenimiento_preventivo(id_mantenimiento_preventivo)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================
-- PASO 8: TABLAS DE REPUESTOS Y LLAMADOS
-- ========================================

-- Tabla repuesto
CREATE TABLE IF NOT EXISTS repuesto (
    id_repuesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_repuesto VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    cantidad INT DEFAULT 0,
    grupo VARCHAR(255) NULL,
    valor DECIMAL(10,2) NULL,
    iva DECIMAL(5,2) NULL,
    activo TINYINT(1) DEFAULT 1,
    id_equipo_fk INT NULL,
    id_tipo_equipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_repuesto_equipo
        FOREIGN KEY (id_equipo_fk) REFERENCES equipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_repuesto_tipo_equipo
        FOREIGN KEY (id_tipo_equipo_fk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla llamado
CREATE TABLE IF NOT EXISTS llamado (
    id_llamado INT AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(255) NULL,
    atencion_prioridad VARCHAR(255) NULL,
    atendido TINYINT(1) DEFAULT 0,
    calificacion INT NULL,
    confirmacion_telefono VARCHAR(255) NULL,
    descripcion TEXT NULL,
    estado VARCHAR(255) DEFAULT 'Pendiente',
    fecha DATE NULL,
    fecha_r DATE NULL,
    fecha_sn DATE NULL,
    hora_llamado TIME NULL,
    hora_respuesta TIME NULL,
    hora_solucion TIME NULL,
    palabras_clave VARCHAR(255) NULL,
    por_telefono TINYINT(1) DEFAULT 0,
    prioridad ENUM('Baja', 'Media', 'Alta', 'Urgente') DEFAULT 'Media',
    realizado TINYINT(1) DEFAULT 0,
    serie VARCHAR(255) NULL,
    solucion TEXT NULL,
    tipo VARCHAR(255) NULL,
    ubicacion_exacta VARCHAR(255) NULL,
    bitacora TEXT NULL,
    foto VARCHAR(255) NULL,
    solucionado_por VARCHAR(255) NULL,
    afecta_paciente TINYINT(1) DEFAULT 0,
    equipo_desabilitado TINYINT(1) DEFAULT 0,
    tiempo_parada INT NULL,
    id_serviciofk INT NULL,
    tipo_equipo INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_llamado_servicio
        FOREIGN KEY (id_serviciofk) REFERENCES servicio(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_llamado_tipo_equipo
        FOREIGN KEY (tipo_equipo) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================
-- PASO 9: TABLAS DE SISTEMAS
-- ========================================

-- Tabla sysequipo
CREATE TABLE IF NOT EXISTS sysequipo (
    id_sysequipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    placa_inventario VARCHAR(255) NULL,
    codigo VARCHAR(255) NULL,
    ubicacion VARCHAR(255) NULL,
    ubicacion_especifica VARCHAR(255) NULL,
    activo TINYINT(1) DEFAULT 1,
    ano_ingreso INT NULL,
    dias_mantenimiento INT NULL,
    periodicidad INT NULL,
    estado_baja TINYINT(1) DEFAULT 0,
    administrable TINYINT(1) DEFAULT 0,
    direccionamiento_Vlan VARCHAR(255) NULL,
    numero_puertos INT NULL,
    mtto TINYINT(1) DEFAULT 1,
    id_hospital_fk INT NULL,
    id_servicio_fk INT NULL,
    id_tipo_equipo_fk INT NULL,
    id_usuario_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sysequipo_hospital
        FOREIGN KEY (id_hospital_fk) REFERENCES hospital(id_hospital)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_sysequipo_servicio
        FOREIGN KEY (id_servicio_fk) REFERENCES servicio(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_sysequipo_tipo_equipo
        FOREIGN KEY (id_tipo_equipo_fk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_sysequipo_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla syshoja_vida
CREATE TABLE IF NOT EXISTS syshoja_vida (
    id_syshoja_vida INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(255) NULL,
    mac VARCHAR(255) NULL,
    procesador VARCHAR(255) NULL,
    ram VARCHAR(255) NULL,
    disco_duro VARCHAR(255) NULL,
    sistema_operativo VARCHAR(255) NULL,
    office VARCHAR(255) NULL,
    tonner VARCHAR(255) NULL,
    nombre_usuario VARCHAR(255) NULL,
    vendedor VARCHAR(255) NULL,
    tipo_uso VARCHAR(255) NULL,
    fecha_compra DATETIME NULL,
    fecha_instalacion DATETIME NULL,
    costo_compra INT NULL,
    contrato VARCHAR(255) NULL,
    observaciones TEXT NULL,
    foto VARCHAR(255) NULL,
    compraddirecta TINYINT(1) DEFAULT 0,
    convenio TINYINT(1) DEFAULT 0,
    donado TINYINT(1) DEFAULT 0,
    comodato TINYINT(1) DEFAULT 0,
    id_sysequipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_syshoja_vida_sysequipo
        FOREIGN KEY (id_sysequipo_fk) REFERENCES sysequipo(id_sysequipo)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla sysmantenimiento
CREATE TABLE IF NOT EXISTS sysmantenimiento (
    id_sysmtto INT AUTO_INCREMENT PRIMARY KEY,
    numero_reporte VARCHAR(255) NULL,
    fecha DATE NULL,
    hora_llamado TIME NULL,
    hora_inicio TIME NULL,
    hora_terminacion TIME NULL,
    tipo_mantenimiento ENUM('Correctivo', 'Preventivo', 'Predictivo', 'Otro') NULL,
    tipo_falla ENUM('Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios', 'Desconocido', 'Sin Falla', 'Otros', 'No Registra') NULL,
    mphardware TEXT NULL,
    mpsoftware TEXT NULL,
    rutinah TEXT NULL,
    rutinas TEXT NULL,
    observacionesh TEXT NULL,
    observacioness TEXT NULL,
    autor_realizado VARCHAR(255) NULL,
    autor_recibido VARCHAR(255) NULL,
    tiempo_fuera_servicio INT NULL,
    dano TEXT NULL,
    entega TEXT NULL,
    rutahardware VARCHAR(255) NULL,
    rutasoftware VARCHAR(255) NULL,
    rutaentrega VARCHAR(255) NULL,
    id_sysequipo_fk INT NULL,
    id_sysusuario_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sysmantenimiento_sysequipo
        FOREIGN KEY (id_sysequipo_fk) REFERENCES sysequipo(id_sysequipo)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_sysmantenimiento_usuario
        FOREIGN KEY (id_sysusuario_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla sysrepuestos
CREATE TABLE IF NOT EXISTS sysrepuestos (
    id_sysrepuesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    ubicacion VARCHAR(255) NULL,
    observaciones TEXT NULL,
    activo TINYINT(1) DEFAULT 1,
    id_sys_equipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sysrepuestos_sysequipo
        FOREIGN KEY (id_sys_equipo_fk) REFERENCES sysequipo(id_sysequipo)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla sysbaja
CREATE TABLE IF NOT EXISTS sysbaja (
    id_sysbaja INT AUTO_INCREMENT PRIMARY KEY,
    fecha_baja DATE NULL,
    justificacion_baja TEXT NULL,
    accesorios_reutilizables TEXT NULL,
    id_sysequipo_fk INT NULL,
    id_sysusuario_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sysbaja_sysequipo
        FOREIGN KEY (id_sysequipo_fk) REFERENCES sysequipo(id_sysequipo)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_sysbaja_usuario
        FOREIGN KEY (id_sysusuario_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla reporte_backup
CREATE TABLE IF NOT EXISTS reporte_backup (
    id_reporte_backup INT AUTO_INCREMENT PRIMARY KEY,
    nombre_recurso VARCHAR(255) NOT NULL,
    tipo_recurso VARCHAR(255) NULL,
    destino VARCHAR(255) NULL,
    medio VARCHAR(255) NULL,
    periodicidad VARCHAR(255) NULL,
    fecha_backup DATETIME NULL,
    tamano VARCHAR(255) NULL,
    autor_solicita VARCHAR(255) NULL,
    numero_caso_ms VARCHAR(255) NULL,
    observaciones TEXT NULL,
    id_autor_realizado_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reporte_backup_usuario
        FOREIGN KEY (id_autor_realizado_fk) REFERENCES usuario(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================
-- PASO 10: TABLAS DE BIOMÉDICA INDUSTRIAL
-- ========================================

-- Tabla indequipo
CREATE TABLE IF NOT EXISTS indequipo (
    id_indequipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    placa_inventario VARCHAR(255) NULL,
    codigo VARCHAR(255) NULL,
    ubicacion VARCHAR(255) NULL,
    ubicacion_especifica VARCHAR(255) NULL,
    activo TINYINT(1) DEFAULT 1,
    ano_ingreso INT NULL,
    dias_mantenimiento INT NULL,
    periodicidad INT NULL,
    mtto TINYINT(1) DEFAULT 1,
    calibracion TINYINT(1) DEFAULT 0,
    calificacion TINYINT(1) DEFAULT 0,
    validacion TINYINT(1) DEFAULT 0,
    id_hospital_fk INT NULL,
    id_servicio_fk INT NULL,
    id_tipo_equipo_fk INT NULL,
    id_responsable_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_indequipo_hospital
        FOREIGN KEY (id_hospital_fk) REFERENCES hospital(id_hospital)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_indequipo_servicio
        FOREIGN KEY (id_servicio_fk) REFERENCES servicio(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_indequipo_tipo_equipo
        FOREIGN KEY (id_tipo_equipo_fk) REFERENCES tipoequipo(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_indequipo_responsable
        FOREIGN KEY (id_responsable_fk) REFERENCES responsable(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Tabla indhoja_vida
CREATE TABLE IF NOT EXISTS indhoja_vida (
    id_indhoja_vida INT AUTO_INCREMENT PRIMARY KEY,
    fabricante VARCHAR(255) NULL,
    distribuidor VARCHAR(255) NULL,
    capacidad VARCHAR(255) NULL,
    peso VARCHAR(255) NULL,
    presion VARCHAR(255) NULL,
    temperatura VARCHAR(255) NULL,
    frecuencia VARCHAR(255) NULL,
    vmaxoperacion VARCHAR(255) NULL,
    vminoperacion VARCHAR(255) NULL,
    fecha_compra DATETIME NULL,
    fecha_instalacion DATETIME NULL,
    costo_compra INT NULL,
    manual_operacion VARCHAR(255) NULL,
    manual_tecnico VARCHAR(255) NULL,
    foto VARCHAR(255) NULL,
    clasificacionapoyo VARCHAR(255) NULL,
    clasificacionautoclaves VARCHAR(255) NULL,
    clasificacionbombas VARCHAR(255) NULL,
    clasificacionlavanderia VARCHAR(255) NULL,
    clasificacionplantas VARCHAR(255) NULL,
    id_indequipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_indhoja_vida_indequipo
        FOREIGN KEY (id_indequipo_fk) REFERENCES indequipo(id_indequipo)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla indrepuesto
CREATE TABLE IF NOT EXISTS indrepuesto (
    id_indrepuesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_repuesto VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    serie VARCHAR(255) NULL,
    ubicacion VARCHAR(255) NULL,
    observaciones TEXT NULL,
    activo TINYINT(1) DEFAULT 1,
    id_indequipo_fk INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_indrepuesto_indequipo
        FOREIGN KEY (id_indequipo_fk) REFERENCES indequipo(id_indequipo)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================
-- PASO 11: ÍNDICES ADICIONALES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_hospital_estado ON hospital(estado);
CREATE INDEX IF NOT EXISTS idx_baja_hospital ON baja(id_hospital_fk);
CREATE INDEX IF NOT EXISTS idx_sysequipo_servicio ON sysequipo(id_servicio_fk);
CREATE INDEX IF NOT EXISTS idx_sysequipo_activo ON sysequipo(activo);
CREATE INDEX IF NOT EXISTS idx_indequipo_servicio ON indequipo(id_servicio_fk);
CREATE INDEX IF NOT EXISTS idx_indequipo_activo ON indequipo(activo);
CREATE INDEX IF NOT EXISTS idx_llamado_estado ON llamado(estado);
CREATE INDEX IF NOT EXISTS idx_llamado_fecha ON llamado(fecha);
CREATE INDEX IF NOT EXISTS idx_mantenimiento_preventivo_realizado ON mantenimiento_preventivo(realizado);
CREATE INDEX IF NOT EXISTS idx_repuesto_activo ON repuesto(activo);
CREATE INDEX IF NOT EXISTS idx_usuario_rolId ON usuario(rolId);

-- ========================================
-- FIN DEL MODELO COMPLETO
-- ========================================

-- Mensaje de confirmación
SELECT 'Modelo completo de base de datos creado exitosamente' AS Mensaje;

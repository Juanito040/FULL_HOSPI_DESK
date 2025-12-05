/**
 * Script de configuración de equipos con hojas de vida
 * Hospital San Rafael - Sistema de Gestión de Equipos
 *
 * Este script inserta equipos biomédicos y de sistemas con sus hojas de vida
 * Ejecutar con: node setup-equipos.js
 */

const db = require('../src/models/sequelize');

/**
 * Datos iniciales necesarios
 */
async function crearDatosBase() {
  console.log('📦 Verificando datos base...\n');

  // Crear hospital si no existe
  const [hospital] = await db.Hospital.findOrCreate({
    where: { id_hospital: 1 },
    defaults: {
      id_hospital: 1,
      nombre_hospital: 'Hospital San Rafael',
      direccion_hospital: 'Calle Principal #123',
      nit_hospital: '900123456-7',
      ciudad: 'Tunja',
      departamento: 'Boyacá',
      estado: 1,
      nivel: 3
    }
  });
  console.log('  ✓ Hospital configurado');

  // Crear servicios
  const serviciosData = [
    { id: 1, nombres: 'Urgencias', ubicacion: 'Piso 1 - Ala Norte', activo: 1 },
    { id: 2, nombres: 'UCI', ubicacion: 'Piso 3 - Ala Este', activo: 1 },
    { id: 3, nombres: 'Quirófano', ubicacion: 'Piso 2 - Central', activo: 1 },
    { id: 4, nombres: 'Sistemas', ubicacion: 'Piso 4 - Datacenter', activo: 1 }
  ];

  for (const servicio of serviciosData) {
    await db.Servicio.findOrCreate({
      where: { id: servicio.id },
      defaults: servicio
    });
  }
  console.log('  ✓ Servicios configurados');

  // Crear tipos de equipo
  const tiposEquipoData = [
    {
      id: 1,
      nombres: 'Monitor de Signos Vitales',
      materialConsumible: 'Electrodos, gel conductor',
      herramienta: 'Multímetro, destornilladores',
      tiempoMinutos: '45',
      repuestosMinimos: 'Cable de poder, fusibles',
      tipoR: 1,
      actividad: 'Limpieza, calibración de sensores',
      activo: 1
    },
    {
      id: 2,
      nombres: 'Desfibrilador',
      materialConsumible: 'Gel conductor',
      herramienta: 'Analizador de desfibriladores',
      tiempoMinutos: '60',
      repuestosMinimos: 'Baterías, electrodos',
      tipoR: 1,
      actividad: 'Prueba de carga, calibración',
      activo: 1
    },
    {
      id: 3,
      nombres: 'Computador de Escritorio',
      materialConsumible: 'Aire comprimido',
      herramienta: 'Destornilladores',
      tiempoMinutos: '30',
      repuestosMinimos: 'Disco duro, RAM',
      tipoR: 0,
      actividad: 'Limpieza, actualización de software',
      activo: 1
    },
    {
      id: 4,
      nombres: 'Servidor',
      materialConsumible: 'Aire comprimido',
      herramienta: 'Herramientas de diagnóstico',
      tiempoMinutos: '45',
      repuestosMinimos: 'Discos duros, RAM',
      tipoR: 0,
      actividad: 'Verificación de RAID, actualización de OS',
      activo: 1
    },
    {
      id: 5,
      nombres: 'Switch de Red',
      materialConsumible: 'Ninguno',
      herramienta: 'Cable tester',
      tiempoMinutos: '20',
      repuestosMinimos: 'Fuente de poder',
      tipoR: 0,
      actividad: 'Verificación de puertos',
      activo: 1
    }
  ];

  for (const tipo of tiposEquipoData) {
    await db.TipoEquipo.findOrCreate({
      where: { id: tipo.id },
      defaults: tipo
    });
  }
  console.log('  ✓ Tipos de equipo configurados');

  // Crear sedes
  const [sede] = await db.Sede.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      nombres: 'Sede Principal',
      direccion: 'Calle 10 #15-20',
      nit: '900123456-1',
      ciudad: 'Tunja',
      departamento: 'Boyacá',
      estado: 1,
      nivel: 3
    }
  });
  console.log('  ✓ Sedes configuradas');

  // Crear responsables
  const responsablesData = [
    { id: 1, nombres: 'Ing. Pedro Martínez', garantia: 0, externo: 0, calificacion: 5 },
    { id: 2, nombres: 'Téc. Laura Sánchez', garantia: 0, externo: 0, calificacion: 4 }
  ];

  for (const resp of responsablesData) {
    await db.Responsable.findOrCreate({
      where: { id: resp.id },
      defaults: resp
    });
  }
  console.log('  ✓ Responsables configurados');

  // Crear fabricantes
  const fabricantesData = [
    { id: 1, nombres: 'Philips Healthcare', pais: 'Países Bajos', estado: 1 },
    { id: 2, nombres: 'GE Healthcare', pais: 'Estados Unidos', estado: 1 },
    { id: 3, nombres: 'Dell Technologies', pais: 'Estados Unidos', estado: 1 },
    { id: 4, nombres: 'Cisco Systems', pais: 'Estados Unidos', estado: 1 }
  ];

  for (const fab of fabricantesData) {
    await db.Fabricante.findOrCreate({
      where: { id: fab.id },
      defaults: fab
    });
  }
  console.log('  ✓ Fabricantes configurados');

  // Crear proveedores
  const proveedoresData = [
    {
      id: 1,
      nombres: 'MediTech Colombia',
      telefono: '3101234567',
      correo: 'ventas@meditech.com.co',
      ciudad: 'Bogotá',
      representante: 'Carlos Rodríguez',
      telRepresentante: '3109876543',
      estado: 1
    },
    {
      id: 2,
      nombres: 'Sistemas y Redes SAS',
      telefono: '3123456789',
      correo: 'comercial@sistemasredes.com',
      ciudad: 'Bogotá',
      representante: 'Juan Pérez',
      telRepresentante: '3145678901',
      estado: 1
    }
  ];

  for (const prov of proveedoresData) {
    await db.Proveedor.findOrCreate({
      where: { id: prov.id },
      defaults: prov
    });
  }
  console.log('  ✓ Proveedores configurados');

  // Crear datos técnicos
  const datosTecnicosData = [
    {
      id: 1,
      vMaxOperacion: '220V',
      vMinOperacion: '110V',
      iMaxOperacion: '5A',
      iMinOperacion: '1A',
      wConsumida: '500W',
      frecuencia: '60Hz',
      presion: 'N/A',
      velocidad: 'N/A',
      temperatura: '25°C',
      peso: '15kg',
      capacidad: 'N/A'
    },
    {
      id: 2,
      vMaxOperacion: '240V',
      vMinOperacion: '100V',
      iMaxOperacion: '10A',
      iMinOperacion: '2A',
      wConsumida: '1200W',
      frecuencia: '50-60Hz',
      presion: 'N/A',
      velocidad: 'N/A',
      temperatura: '30°C',
      peso: '8kg',
      capacidad: 'N/A'
    }
  ];

  for (const datos of datosTecnicosData) {
    await db.DatosTecnicos.findOrCreate({
      where: { id: datos.id },
      defaults: datos
    });
  }
  console.log('  ✓ Datos técnicos configurados');

  console.log('');
}

/**
 * Equipos biomédicos a crear
 */
const equiposBiomedicos = [
  {
    equipo: {
      nombres: 'Monitor de Signos Vitales Philips',
      marca: 'Philips',
      modelo: 'IntelliVue MP70',
      serie: 'PH-MSV-2024-001',
      placa: 'BIO-001',
      registroInvima: 'REG-INVIMA-001',
      riesgo: 'IIB',
      ubicacion: 'UCI',
      ubicacionEspecifica: 'Habitación 301',
      activo: 1,
      periodicidadM: 3,
      periodicidadC: 12,
      estadoBaja: 0,
      calibracion: 1,
      calificacion: 0,
      validacion: 0,
      tipoEquipoIdFk: 1,
      servicioIdFk: 2,
      sedeIdFk: 1,
      responsableIdFk: 1
    },
    hojaVida: {
      codigoInternacional: 'MSV-INT-001',
      anoIngreso: 2024,
      contrato: 'CT-2024-001',
      tipoAdquisicion: 'Compra',
      fechaCompra: new Date('2024-01-15'),
      fechaInstalacion: new Date('2024-02-01'),
      fechaIncorporacion: new Date('2024-02-05'),
      fechaVencimientoGarantia: new Date('2027-02-01'),
      costoCompra: 35000000,
      fuente: 'Electricidad',
      tipoUso: 'Soporte Vital',
      clase: 'Electronico',
      mantenimiento: 'Propio',
      propiedad: 'Hospital',
      equipoPortatil: 0,
      observaciones: 'Monitor principal de UCI',
      datosTecnicosIdFk: 1,
      fabricanteIdFk: 1,
      proveedorIdFk: 1
    }
  },
  {
    equipo: {
      nombres: 'Desfibrilador GE Healthcare',
      marca: 'GE Healthcare',
      modelo: 'Dash 4000',
      serie: 'GE-DEF-2024-001',
      placa: 'BIO-002',
      registroInvima: 'REG-INVIMA-002',
      riesgo: 'III',
      ubicacion: 'Urgencias',
      ubicacionEspecifica: 'Sala de Reanimación',
      activo: 1,
      periodicidadM: 1,
      periodicidadC: 12,
      estadoBaja: 0,
      calibracion: 1,
      calificacion: 1,
      validacion: 0,
      tipoEquipoIdFk: 2,
      servicioIdFk: 1,
      sedeIdFk: 1,
      responsableIdFk: 1
    },
    hojaVida: {
      codigoInternacional: 'DEF-INT-001',
      anoIngreso: 2024,
      contrato: 'CT-2024-002',
      tipoAdquisicion: 'Compra',
      fechaCompra: new Date('2024-03-10'),
      fechaInstalacion: new Date('2024-03-20'),
      fechaIncorporacion: new Date('2024-03-22'),
      fechaVencimientoGarantia: new Date('2027-03-20'),
      costoCompra: 28000000,
      fuente: 'Electricidad',
      tipoUso: 'Terapéutico',
      clase: 'Electronico',
      mantenimiento: 'Propio',
      propiedad: 'Hospital',
      equipoPortatil: 1,
      observaciones: 'Desfibrilador de emergencias',
      datosTecnicosIdFk: 2,
      fabricanteIdFk: 2,
      proveedorIdFk: 1
    }
  }
];

/**
 * Equipos de sistemas a crear
 */
const equiposSistemas = [
  {
    equipo: {
      nombre_equipo: 'Servidor Dell Base de Datos',
      marca: 'Dell',
      modelo: 'PowerEdge R740',
      serie: 'DELL-SRV-2024-001',
      placa_inventario: 'SYS-001',
      codigo: 'SRV-DB-001',
      ubicacion: 'Datacenter Principal',
      ubicacion_especifica: 'Rack A - U15',
      activo: true,
      ano_ingreso: new Date('2024-01-01'),
      periodicidad: 3,
      estado_baja: false,
      administrable: false,
      id_servicio_fk: 4,
      id_tipo_equipo_fk: 4
    },
    hojaVida: {
      ip: '192.168.1.10',
      mac: '00:1A:2B:3C:4D:5E',
      procesador: 'Intel Xeon Silver 4214',
      ram: '64GB DDR4',
      disco_duro: '2TB SSD RAID 1',
      sistema_operativo: 'Ubuntu Server 22.04 LTS',
      office: 'N/A',
      tonner: 'N/A',
      nombre_usuario: 'DBA Principal',
      vendedor: 'Sistemas y Redes SAS',
      tipo_uso: 'Servidor de Base de Datos',
      fecha_compra: new Date('2024-01-15'),
      fecha_instalacion: new Date('2024-01-20'),
      costo_compra: '18000000',
      contrato: 'CT-SYS-2024-001',
      observaciones: 'Servidor principal MySQL/MariaDB',
      compraddirecta: true,
      convenio: false,
      donado: false,
      comodato: false
    }
  },
  {
    equipo: {
      nombre_equipo: 'Switch Cisco Core 48 Puertos',
      marca: 'Cisco',
      modelo: 'Catalyst 2960-X',
      serie: 'FCW2145L0ME',
      placa_inventario: 'SYS-002',
      codigo: 'SW-CORE-001',
      ubicacion: 'Datacenter Principal',
      ubicacion_especifica: 'Rack A - U10',
      activo: true,
      ano_ingreso: new Date('2024-01-01'),
      periodicidad: 6,
      estado_baja: false,
      administrable: true,
      direccionamiento_Vlan: '192.168.1.254/24',
      numero_puertos: 48,
      id_servicio_fk: 4,
      id_tipo_equipo_fk: 5
    },
    hojaVida: {
      ip: '192.168.1.254',
      mac: '00:1A:2B:3C:4D:5F',
      procesador: 'N/A',
      ram: 'N/A',
      disco_duro: 'N/A',
      sistema_operativo: 'Cisco IOS 15.2',
      office: 'N/A',
      tonner: 'N/A',
      nombre_usuario: 'Admin de Red',
      vendedor: 'Sistemas y Redes SAS',
      tipo_uso: 'Networking - Core Switch',
      fecha_compra: new Date('2024-01-10'),
      fecha_instalacion: new Date('2024-01-15'),
      costo_compra: '8500000',
      contrato: 'CT-SYS-2024-002',
      observaciones: 'Switch principal del datacenter',
      compraddirecta: true,
      convenio: false,
      donado: false,
      comodato: false
    }
  },
  {
    equipo: {
      nombre_equipo: 'PC Administración 01',
      marca: 'Dell',
      modelo: 'OptiPlex 7090',
      serie: 'DELL-PC-ADM-001',
      placa_inventario: 'SYS-003',
      codigo: 'PC-ADM-001',
      ubicacion: 'Área Administrativa',
      ubicacion_especifica: 'Recepción Principal',
      activo: true,
      ano_ingreso: new Date('2024-02-01'),
      periodicidad: 6,
      estado_baja: false,
      administrable: false,
      id_servicio_fk: 4,
      id_tipo_equipo_fk: 3
    },
    hojaVida: {
      ip: '192.168.2.50',
      mac: '00:1A:2B:3C:4D:60',
      procesador: 'Intel Core i5-11500',
      ram: '16GB DDR4',
      disco_duro: '512GB SSD',
      sistema_operativo: 'Windows 11 Pro',
      office: 'Office 2021',
      tonner: 'N/A',
      nombre_usuario: 'Recepcionista Principal',
      vendedor: 'Sistemas y Redes SAS',
      tipo_uso: 'Estación de Trabajo Administrativa',
      fecha_compra: new Date('2024-02-01'),
      fecha_instalacion: new Date('2024-02-05'),
      costo_compra: '2500000',
      contrato: 'CT-SYS-2024-003',
      observaciones: 'PC para área de admisiones',
      compraddirecta: true,
      convenio: false,
      donado: false,
      comodato: false
    }
  }
];

/**
 * Función principal
 */
async function setupEquipos() {
  try {
    console.log('🔄 Iniciando configuración de equipos...\n');

    // Sincronizar modelos
    console.log('📋 Sincronizando modelos con la base de datos...');
    await db.sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados\n');

    // Crear datos base
    await crearDatosBase();

    // ========================================
    // EQUIPOS BIOMÉDICOS
    // ========================================
    console.log('🏥 Creando equipos biomédicos...\n');

    for (const item of equiposBiomedicos) {
      try {
        // Verificar si ya existe
        const existente = await db.Equipo.findOne({
          where: { serie: item.equipo.serie }
        });

        if (existente) {
          console.log(`  ⚠️  Equipo biomédico ya existe: ${item.equipo.nombres} (${item.equipo.serie})`);
          continue;
        }

        // Crear equipo
        const equipo = await db.Equipo.create(item.equipo);
        console.log(`  ✓ Equipo creado: ${item.equipo.nombres}`);
        console.log(`    - Serie: ${item.equipo.serie}`);
        console.log(`    - Placa: ${item.equipo.placa}`);

        // Crear hoja de vida
        const hojaVida = await db.HojaVida.create({
          ...item.hojaVida,
          equipoIdFk: equipo.id
        });
        console.log(`    - Hoja de vida creada (ID: ${hojaVida.id})`);
        console.log('');

      } catch (error) {
        console.log(`  ❌ Error al crear equipo biomédico: ${error.message}`);
      }
    }

    // ========================================
    // EQUIPOS DE SISTEMAS
    // ========================================
    console.log('💻 Creando equipos de sistemas...\n');

    for (const item of equiposSistemas) {
      try {
        // Verificar si ya existe
        const existente = await db.SysEquipo.findOne({
          where: { serie: item.equipo.serie }
        });

        if (existente) {
          console.log(`  ⚠️  Equipo de sistemas ya existe: ${item.equipo.nombre_equipo} (${item.equipo.serie})`);
          continue;
        }

        // Crear equipo de sistemas
        const equipo = await db.SysEquipo.create(item.equipo);
        console.log(`  ✓ Equipo creado: ${item.equipo.nombre_equipo}`);
        console.log(`    - Serie: ${item.equipo.serie}`);
        console.log(`    - Código: ${item.equipo.codigo}`);

        // Crear hoja de vida de sistemas
        const hojaVida = await db.SysHojaVida.create({
          ...item.hojaVida,
          id_sysequipo_fk: equipo.id_sysequipo
        });
        console.log(`    - Hoja de vida creada (ID: ${hojaVida.id_syshoja_vida})`);
        console.log(`    - IP: ${item.hojaVida.ip}`);
        console.log('');

      } catch (error) {
        console.log(`  ❌ Error al crear equipo de sistemas: ${error.message}`);
      }
    }

    // Mostrar resumen
    console.log('\n' + '='.repeat(70));
    console.log('✅ EQUIPOS CREADOS EXITOSAMENTE');
    console.log('='.repeat(70));

    const totalBiomedicos = await db.Equipo.count();
    const totalSistemas = await db.SysEquipo.count();

    console.log(`\n📊 Resumen:`);
    console.log(`   - Equipos Biomédicos: ${totalBiomedicos}`);
    console.log(`   - Equipos de Sistemas: ${totalSistemas}`);
    console.log(`   - Total: ${totalBiomedicos + totalSistemas}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await db.sequelize.close();
    console.log('🔒 Conexión a base de datos cerrada\n');
  }
}

// Ejecutar el script
setupEquipos()
  .then(() => {
    console.log('✨ Script ejecutado exitosamente\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

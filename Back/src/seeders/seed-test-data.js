/**
 * Script para insertar datos de prueba de equipos y hojas de vida
 * Uso: node Back/src/seeders/seed-test-data.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../models/sequelize');

async function seedTestData() {
  try {
    console.log('🔄 Iniciando sincronización de modelos...');
    await db.sync({ alter: false });
    console.log('✅ Modelos sincronizados');

    console.log('\n📊 Insertando datos de prueba...\n');

    // 1. Crear primer equipo (Servidor)
    console.log('1️⃣  Creando Servidor Web de Prueba...');
    const servidor = await db.SysEquipo.create({
      nombre_equipo: 'Servidor Web Apache Prueba',
      marca: 'Dell',
      modelo: 'PowerEdge R740',
      serie: 'SRV-2024-001',
      placa_inventario: 'INV-2024-0001',
      codigo: 'COD-APACHE-001',
      ubicacion: 'Sala de Servidores',
      ubicacion_especifica: 'Rack 5, Posición 2',
      activo: 1,
      ano_ingreso: 2024,
      dias_mantenimiento: 30,
      periodicidad: 30,
      estado_baja: 0,
      administrable: 1,
      direccionamiento_Vlan: '192.168.1.100',
      numero_puertos: 4,
      mtto: 1,
      id_hospital_fk: 1,
      id_servicio_fk: 1,
      id_tipo_equipo_fk: 1,
      id_usuario_fk: 1
    });
    console.log(`✅ Servidor creado con ID: ${servidor.id_sysequipo}\n`);

    // 2. Crear hoja de vida para el servidor
    console.log('2️⃣  Creando Hoja de Vida del Servidor...');
    const hojaVidaServidor = await db.SysHojaVida.create({
      ip: '192.168.1.100',
      mac: '00:0A:95:9D:68:16',
      procesador: 'Intel Xeon Gold 6248 (2 x 20 cores)',
      ram: '128 GB DDR4',
      disco_duro: '2 x 960 GB SSD NVMe',
      sistema_operativo: 'Ubuntu Server 22.04 LTS',
      office: 'N/A',
      tonner: 'N/A',
      nombre_usuario: 'admin',
      vendedor: 'Dell Technologies',
      tipo_uso: 'Servidor Web',
      fecha_compra: new Date('2024-01-15'),
      fecha_instalacion: new Date('2024-02-01'),
      costo_compra: 15000000,
      contrato: 'DTC-2024-001',
      observaciones: 'Servidor de prueba para ambiente de desarrollo. Configuración de alta disponibilidad.',
      foto: null,
      compraddirecta: true,
      id_sysequipo_fk: servidor.id_sysequipo
    });
    console.log(`✅ Hoja de vida del servidor creada con ID: ${hojaVidaServidor.id_syshoja_vida}\n`);

    // 3. Crear segundo equipo (Computador)
    console.log('3️⃣  Creando Computador Administrativo de Prueba...');
    const pc = await db.SysEquipo.create({
      nombre_equipo: 'Computador Administrativo Prueba',
      marca: 'Lenovo',
      modelo: 'ThinkCentre M90',
      serie: 'PC-2024-002',
      placa_inventario: 'INV-2024-0002',
      codigo: 'COD-PC-002',
      ubicacion: 'Área Administrativa',
      ubicacion_especifica: 'Escritorio Piso 1',
      activo: 1,
      ano_ingreso: 2024,
      dias_mantenimiento: 60,
      periodicidad: 60,
      estado_baja: 0,
      administrable: 0,
      direccionamiento_Vlan: '192.168.1.50',
      numero_puertos: 1,
      mtto: 0,
      id_hospital_fk: 1,
      id_servicio_fk: 1,
      id_tipo_equipo_fk: 2,
      id_usuario_fk: 1
    });
    console.log(`✅ Computador creado con ID: ${pc.id_sysequipo}\n`);

    // 4. Crear hoja de vida para el computador
    console.log('4️⃣  Creando Hoja de Vida del Computador...');
    const hojaVidaPC = await db.SysHojaVida.create({
      ip: '192.168.1.50',
      mac: '08:00:27:C7:A6:1F',
      procesador: 'Intel Core i7-10700K',
      ram: '16 GB DDR4',
      disco_duro: '512 GB SSD',
      sistema_operativo: 'Windows 11 Pro',
      office: 'Microsoft Office 2021',
      tonner: 'N/A',
      nombre_usuario: 'jperez',
      vendedor: 'Lenovo',
      tipo_uso: 'Oficina - Administración',
      fecha_compra: new Date('2023-06-20'),
      fecha_instalacion: new Date('2023-07-05'),
      costo_compra: 3500000,
      contrato: 'DTC-2023-045',
      observaciones: 'Computador de uso administrativo. En buen estado.',
      foto: null,
      compraddirecta: false,
      id_sysequipo_fk: pc.id_sysequipo
    });
    console.log(`✅ Hoja de vida del PC creada con ID: ${hojaVidaPC.id_syshoja_vida}\n`);

    // 5. Mostrar resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE DATOS INSERTADOS');
    console.log('='.repeat(60));

    const equipos = await db.SysEquipo.findAll({
      where: { nombre_equipo: { [db.Sequelize.Op.like]: '%Prueba%' } },
      include: [{ model: db.SysHojaVida, as: 'hojaVida' }]
    });

    equipos.forEach((equipo, index) => {
      console.log(`\n${index + 1}. ${equipo.nombre_equipo}`);
      console.log(`   ID: ${equipo.id_sysequipo}`);
      console.log(`   Marca: ${equipo.marca} - Modelo: ${equipo.modelo}`);
      console.log(`   Serie: ${equipo.serie}`);
      console.log(`   Ubicación: ${equipo.ubicacion}`);
      console.log(`   Estado: ${equipo.activo === 1 ? '✅ Activo' : '❌ Inactivo'}`);
      
      if (equipo.hojaVida) {
        console.log(`   📋 Hoja de Vida:`);
        console.log(`      ID: ${equipo.hojaVida.id_syshoja_vida}`);
        console.log(`      IP: ${equipo.hojaVida.ip}`);
        console.log(`      SO: ${equipo.hojaVida.sistema_operativo}`);
        console.log(`      RAM: ${equipo.hojaVida.ram}`);
        console.log(`      Usuario: ${equipo.hojaVida.nombre_usuario}`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ ¡Datos de prueba insertados correctamente!');
    console.log('='.repeat(60));
    console.log('\n💡 Ahora puedes ir a: http://localhost:4200/equipos');
    console.log('   y verás los equipos de prueba en la tabla.\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:');
    console.error(error.message);
    console.error('\n💡 Asegúrate de que:');
    console.error('   1. La base de datos está corriendo');
    console.error('   2. La conexión está correctamente configurada');
    console.error('   3. El backend está iniciado (npm run dev)\n');
    process.exit(1);
  }
}

// Ejecutar el seed
seedTestData();

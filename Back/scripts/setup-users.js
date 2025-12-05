/**
 * Script de configuración de usuarios
 * Hospital San Rafael - Sistema de Gestión de Equipos
 *
 * Este script crea usuarios iniciales en la base de datos
 * Ejecutar con: node setup-users.js
 */

const bcrypt = require('bcryptjs');
const db = require('../src/models/sequelize');

/**
 * Usuarios a crear
 * Puedes modificar esta lista según tus necesidades
 */
const usuarios = [
  {
    nombres: 'Administrador',
    apellidos: 'Sistema',
    nombreUsuario: 'admin',
    tipoId: 'CC',
    numeroId: '1000000000',
    telefono: '3001234567',
    email: 'admin@hospitalsr.com',
    contraseña: 'admin123',
    registroInvima: 'ADM-001',
    estado: 1,
    rolNombre: 'Administrador'
  },
  {
    nombres: 'Juan Carlos',
    apellidos: 'Ramírez',
    nombreUsuario: 'jramirez',
    tipoId: 'CC',
    numeroId: '1234567890',
    telefono: '3101234567',
    email: 'jramirez@hospitalsr.com',
    contraseña: 'biomedico123',
    registroInvima: 'REG-001',
    estado: 1,
    rolNombre: 'Ingeniero Biomédico'
  },
  {
    nombres: 'María Fernanda',
    apellidos: 'López',
    nombreUsuario: 'mlopez',
    tipoId: 'CC',
    numeroId: '0987654321',
    telefono: '3209876543',
    email: 'mlopez@hospitalsr.com',
    contraseña: 'sistemas123',
    registroInvima: 'REG-002',
    estado: 1,
    rolNombre: 'Técnico de Sistemas'
  }
];

/**
 * Roles del sistema
 */
const roles = [
  'Administrador',
  'Ingeniero Biomédico',
  'Técnico de Sistemas',
  'Médico',
  'Enfermera'
];

async function setupDatabase() {
  try {
    console.log('🔄 Iniciando configuración de base de datos...\n');

    // Sincronizar modelos (crear tablas si no existen)
    console.log('📋 Sincronizando modelos con la base de datos...');
    await db.sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados\n');

    // Crear roles
    console.log('👥 Creando roles...');
    for (const nombreRol of roles) {
      const [rol, created] = await db.Rol.findOrCreate({
        where: { nombre: nombreRol },
        defaults: { nombre: nombreRol }
      });

      if (created) {
        console.log(`   ✓ Rol creado: ${nombreRol}`);
      } else {
        console.log(`   - Rol ya existe: ${nombreRol}`);
      }
    }
    console.log('');

    // Crear usuarios
    console.log('👤 Creando usuarios...');
    for (const userData of usuarios) {
      try {
        // Buscar si el usuario ya existe
        const existingUser = await db.Usuario.findOne({
          where: {
            [db.Sequelize.Op.or]: [
              { nombreUsuario: userData.nombreUsuario },
              { email: userData.email }
            ]
          }
        });

        if (existingUser) {
          console.log(`   ⚠️  Usuario ya existe: ${userData.nombreUsuario} (${userData.email})`);
          continue;
        }

        // Buscar el rol
        const rol = await db.Rol.findOne({
          where: { nombre: userData.rolNombre }
        });

        if (!rol) {
          console.log(`   ❌ Error: No se encontró el rol "${userData.rolNombre}"`);
          continue;
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

        // Crear el usuario
        await db.Usuario.create({
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          nombreUsuario: userData.nombreUsuario,
          tipoId: userData.tipoId,
          numeroId: userData.numeroId,
          telefono: userData.telefono,
          email: userData.email,
          contraseña: hashedPassword,
          registroInvima: userData.registroInvima,
          estado: userData.estado,
          rolId: rol.id
        });

        console.log(`   ✓ Usuario creado: ${userData.nombreUsuario}`);
        console.log(`     - Email: ${userData.email}`);
        console.log(`     - Rol: ${userData.rolNombre}`);
        console.log(`     - Contraseña: ${userData.contraseña}`);
        console.log('');

      } catch (error) {
        console.log(`   ❌ Error al crear usuario ${userData.nombreUsuario}: ${error.message}`);
      }
    }

    // Mostrar resumen
    console.log('\n' + '='.repeat(60));
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log('\n📋 CREDENCIALES DE ACCESO:\n');

    for (const user of usuarios) {
      console.log(`👤 ${user.nombres} ${user.apellidos}`);
      console.log(`   Usuario: ${user.nombreUsuario}`);
      console.log(`   Contraseña: ${user.contraseña}`);
      console.log(`   Rol: ${user.rolNombre}`);
      console.log('');
    }

    console.log('='.repeat(60));
    console.log('⚠️  IMPORTANTE: Cambia las contraseñas después del primer login');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error);
    throw error;
  } finally {
    // Cerrar conexión
    await db.sequelize.close();
    console.log('\n🔒 Conexión a base de datos cerrada');
  }
}

// Ejecutar el script
setupDatabase()
  .then(() => {
    console.log('\n✨ Script ejecutado exitosamente\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });

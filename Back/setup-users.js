/**
 * Script para crear usuarios de prueba con contraseñas hasheadas
 * Hospital San Rafael - Sistema de Gestión de Equipos
 *
 * Ejecutar: node setup-users.js
 */

const bcrypt = require('bcryptjs');
const db = require('./src/models/sequelize');

async function setupUsers() {
  try {
    console.log('========================================');
    console.log('Configuración de Autenticación');
    console.log('Hospital San Rafael');
    console.log('========================================\n');

    // Conectar a la base de datos
    await db.testConnection();
    console.log('✓ Conectado a la base de datos\n');

    // 1. CREAR ROLES
    console.log('📋 Creando roles...');
    const roles = [
      { nombre: 'Administrador' },
      { nombre: 'Supervisor' },
      { nombre: 'Técnico' },
      { nombre: 'Usuario' }
    ];

    for (const rol of roles) {
      const [roleRecord, created] = await db.Rol.findOrCreate({
        where: { nombre: rol.nombre },
        defaults: rol
      });

      if (created) {
        console.log(`  ✓ Rol creado: ${rol.nombre}`);
      } else {
        console.log(`  → Rol ya existe: ${rol.nombre}`);
      }
    }
    console.log('');

    // 2. CREAR USUARIOS DE PRUEBA
    console.log('👥 Creando usuarios de prueba...\n');

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
        registroInvima: 'REG-ADMIN-001',
        rolNombre: 'Administrador'
      },
      {
        nombres: 'Supervisor',
        apellidos: 'Técnico',
        nombreUsuario: 'supervisor',
        tipoId: 'CC',
        numeroId: '1000000001',
        telefono: '3001234568',
        email: 'supervisor@hospitalsr.com',
        contraseña: 'super123',
        registroInvima: 'REG-SUP-001',
        rolNombre: 'Supervisor'
      },
      {
        nombres: 'Juan',
        apellidos: 'Técnico',
        nombreUsuario: 'tecnico',
        tipoId: 'CC',
        numeroId: '1000000002',
        telefono: '3001234569',
        email: 'tecnico@hospitalsr.com',
        contraseña: 'tecnico123',
        registroInvima: 'REG-TEC-001',
        rolNombre: 'Técnico'
      }
    ];

    for (const userData of usuarios) {
      // Buscar rol
      const rol = await db.Rol.findOne({ where: { nombre: userData.rolNombre } });

      if (!rol) {
        console.log(`  ✗ Error: Rol '${userData.rolNombre}' no encontrado`);
        continue;
      }

      // Verificar si el usuario ya existe
      const existingUser = await db.Usuario.findOne({
        where: { nombreUsuario: userData.nombreUsuario }
      });

      if (existingUser) {
        console.log(`  → Usuario ya existe: ${userData.nombreUsuario}`);
        continue;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

      // Crear usuario
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
        estado: 1,
        rolId: rol.id
      });

      console.log(`  ✓ Usuario creado: ${userData.nombreUsuario} (${userData.rolNombre})`);
    }

    console.log('\n========================================');
    console.log('CREDENCIALES DE PRUEBA');
    console.log('========================================\n');

    console.log('Administrador:');
    console.log('  Usuario: admin');
    console.log('  Contraseña: admin123\n');

    console.log('Supervisor:');
    console.log('  Usuario: supervisor');
    console.log('  Contraseña: super123\n');

    console.log('Técnico:');
    console.log('  Usuario: tecnico');
    console.log('  Contraseña: tecnico123\n');

    console.log('========================================');
    console.log('✓ Configuración completada exitosamente');
    console.log('========================================\n');

    // Cerrar conexión
    await db.close();
    process.exit(0);

  } catch (error) {
    console.error('\n✗ Error durante la configuración:', error);
    await db.close();
    process.exit(1);
  }
}

// Ejecutar setup
setupUsers();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Insertar roles
    await queryInterface.bulkInsert('rol', [
      { id: 1, nombre: 'Administrador', createdAt: now, updatedAt: now },
      { id: 2, nombre: 'Técnico Biomédico', createdAt: now, updatedAt: now },
      { id: 3, nombre: 'Técnico de Sistemas', createdAt: now, updatedAt: now },
      { id: 4, nombre: 'Usuario', createdAt: now, updatedAt: now }
    ], {});

    // 2. Insertar usuario administrador por defecto
    // NOTA: En producción, deberías hashear la contraseña con bcrypt
    await queryInterface.bulkInsert('usuario', [{
      id: 1,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      nombreUsuario: 'admin',
      tipoId: 'CC',
      numeroId: '1234567890',
      telefono: '3001234567',
      email: 'admin@hospitalsanrafael.com',
      contraseña: 'admin123', // CAMBIAR en producción
      registroInvima: 'N/A',
      estado: 1,
      rolId: 1,
      createdAt: now,
      updatedAt: now
    }], {});

    // 3. Insertar servicios
    await queryInterface.bulkInsert('servicio', [
      { id: 1, nombres: 'Urgencias', ubicacion: 'Piso 1', activo: 1, createdAt: now, updatedAt: now },
      { id: 2, nombres: 'Hospitalización', ubicacion: 'Piso 2', activo: 1, createdAt: now, updatedAt: now },
      { id: 3, nombres: 'Cirugía', ubicacion: 'Piso 3', activo: 1, createdAt: now, updatedAt: now },
      { id: 4, nombres: 'UCI', ubicacion: 'Piso 4', activo: 1, createdAt: now, updatedAt: now },
      { id: 5, nombres: 'Laboratorio', ubicacion: 'Piso 1', activo: 1, createdAt: now, updatedAt: now },
      { id: 6, nombres: 'Sistemas', ubicacion: 'Sótano', activo: 1, createdAt: now, updatedAt: now }
    ], {});

    // 4. Insertar sedes
    await queryInterface.bulkInsert('sede', [{
      id: 1,
      nombres: 'Hospital San Rafael - Sede Principal',
      direccion: 'Calle Principal #123',
      nit: '900123456-1',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      estado: 1,
      nivel: 3,
      createdAt: now,
      updatedAt: now
    }], {});

    // 5. Insertar tipos de equipo
    await queryInterface.bulkInsert('tipoequipo', [
      {
        id: 1,
        nombres: 'Monitor de Signos Vitales',
        materialConsumible: 'Electrodos, sensores',
        herramienta: 'Destornillador, multímetro',
        tiempoMinutos: '30',
        repuestosMinimos: 'Cable de alimentación, sensores',
        tipoR: 0,
        actividad: 'Calibración, limpieza',
        activo: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        nombres: 'Computador de Escritorio',
        materialConsumible: 'N/A',
        herramienta: 'Destornillador, software diagnóstico',
        tiempoMinutos: '45',
        repuestosMinimos: 'Disco duro, RAM',
        tipoR: 1,
        actividad: 'Mantenimiento preventivo, actualización',
        activo: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        nombres: 'Impresora',
        materialConsumible: 'Toner, papel',
        herramienta: 'Kit de limpieza',
        tiempoMinutos: '20',
        repuestosMinimos: 'Toner, rodillo',
        tipoR: 1,
        actividad: 'Limpieza, calibración',
        activo: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // 6. Insertar responsables
    await queryInterface.bulkInsert('responsable', [
      { id: 1, nombres: 'Área de Biomédica', garantia: 0, externo: 0, calificacion: 5, createdAt: now, updatedAt: now },
      { id: 2, nombres: 'Área de Sistemas', garantia: 0, externo: 0, calificacion: 5, createdAt: now, updatedAt: now },
      { id: 3, nombres: 'Proveedor Externo', garantia: 1, externo: 1, calificacion: 4, createdAt: now, updatedAt: now }
    ], {});

    // 7. Insertar fabricantes
    await queryInterface.bulkInsert('fabricante', [
      { id: 1, nombres: 'Philips Healthcare', pais: 'Países Bajos', estado: 1, createdAt: now, updatedAt: now },
      { id: 2, nombres: 'GE Healthcare', pais: 'Estados Unidos', estado: 1, createdAt: now, updatedAt: now },
      { id: 3, nombres: 'HP Inc.', pais: 'Estados Unidos', estado: 1, createdAt: now, updatedAt: now },
      { id: 4, nombres: 'Dell Technologies', pais: 'Estados Unidos', estado: 1, createdAt: now, updatedAt: now }
    ], {});

    // 8. Insertar proveedores
    await queryInterface.bulkInsert('proveedor', [
      {
        id: 1,
        nombres: 'Distribuidora Médica SAS',
        telefono: '6012345678',
        correo: 'ventas@distmedica.com',
        ciudad: 'Bogotá',
        representante: 'Juan Pérez',
        telRepresentante: '3101234567',
        estado: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        nombres: 'TecnoSistemas Ltda',
        telefono: '6017654321',
        correo: 'info@tecnosistemas.com',
        ciudad: 'Medellín',
        representante: 'María García',
        telRepresentante: '3209876543',
        estado: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // 9. Insertar tipos de documento
    await queryInterface.bulkInsert('tipodocumento', [
      { id: 1, nombres: 'Manual de Usuario', createdAt: now, updatedAt: now },
      { id: 2, nombres: 'Manual Técnico', createdAt: now, updatedAt: now },
      { id: 3, nombres: 'Certificado de Calibración', createdAt: now, updatedAt: now },
      { id: 4, nombres: 'Orden de Compra', createdAt: now, updatedAt: now },
      { id: 5, nombres: 'Registro Invima', createdAt: now, updatedAt: now }
    ], {});

    // 10. Insertar hospital
    await queryInterface.bulkInsert('hospital', [{
      id_hospital: 1,
      nombre_hospital: 'Hospital San Rafael',
      direccion_hospital: 'Calle Principal #123',
      nit_hospital: '900123456-1',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      estado: 1,
      nivel: 3,
      createdAt: now,
      updatedAt: now
    }], {});

    console.log('✓ Datos iniciales insertados correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar en orden inverso para respetar las foreign keys
    await queryInterface.bulkDelete('hospital', null, {});
    await queryInterface.bulkDelete('tipodocumento', null, {});
    await queryInterface.bulkDelete('proveedor', null, {});
    await queryInterface.bulkDelete('fabricante', null, {});
    await queryInterface.bulkDelete('responsable', null, {});
    await queryInterface.bulkDelete('tipoequipo', null, {});
    await queryInterface.bulkDelete('sede', null, {});
    await queryInterface.bulkDelete('servicio', null, {});
    await queryInterface.bulkDelete('usuario', null, {});
    await queryInterface.bulkDelete('rol', null, {});
  }
};

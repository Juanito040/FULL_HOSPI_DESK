module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Insertar equipos de sistemas de ejemplo
    await queryInterface.bulkInsert('sysequipo', [
      {
        id_sysequipo: 1,
        nombre_equipo: 'Computador Dell OptiPlex 7090',
        marca: 'Dell',
        modelo: 'OptiPlex 7090',
        serie: 'DELL-2024-001',
        placa_inventario: 'INV-SYS-001',
        codigo: 'SYS-001',
        ubicacion: 'Urgencias',
        ubicacion_especifica: 'Estación de Enfermería',
        activo: 1,
        ano_ingreso: 2024,
        dias_mantenimiento: 90,
        periodicidad: 4, // Trimestral
        estado_baja: 0,
        administrable: 0,
        direccionamiento_Vlan: null,
        numero_puertos: null,
        mtto: 1,
        responsabilidad_mantenimiento: 'Propio',
        fecha_mantenimiento_1: new Date('2025-03-01'),
        fecha_mantenimiento_2: new Date('2025-06-01'),
        fecha_mantenimiento_3: new Date('2025-09-01'),
        fecha_mantenimiento_4: new Date('2025-12-01'),
        ingresa_servicios: 1,
        mtto_software: 1,
        id_hospital_fk: 1,
        id_servicio_fk: 6,
        id_tipo_equipo_fk: 2,
        id_usuario_fk: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id_sysequipo: 2,
        nombre_equipo: 'Impresora HP LaserJet Pro',
        marca: 'HP',
        modelo: 'LaserJet Pro M404dn',
        serie: 'HP-2024-001',
        placa_inventario: 'INV-SYS-002',
        codigo: 'SYS-002',
        ubicacion: 'Hospitalización',
        ubicacion_especifica: 'Oficina Administrativa',
        activo: 1,
        ano_ingreso: 2024,
        dias_mantenimiento: 60,
        periodicidad: 2, // Semestral
        estado_baja: 0,
        administrable: 0,
        direccionamiento_Vlan: null,
        numero_puertos: null,
        mtto: 1,
        responsabilidad_mantenimiento: 'Contratado',
        fecha_mantenimiento_1: new Date('2025-06-01'),
        fecha_mantenimiento_2: new Date('2025-12-01'),
        fecha_mantenimiento_3: null,
        fecha_mantenimiento_4: null,
        ingresa_servicios: 1,
        mtto_software: 0,
        id_hospital_fk: 1,
        id_servicio_fk: 6,
        id_tipo_equipo_fk: 3,
        id_usuario_fk: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id_sysequipo: 3,
        nombre_equipo: 'Switch Cisco 24 puertos',
        marca: 'Cisco',
        modelo: 'Catalyst 2960',
        serie: 'CISCO-2024-001',
        placa_inventario: 'INV-SYS-003',
        codigo: 'SYS-003',
        ubicacion: 'Sistemas',
        ubicacion_especifica: 'Rack Principal',
        activo: 1,
        ano_ingreso: 2024,
        dias_mantenimiento: 180,
        periodicidad: 1, // Anual
        estado_baja: 0,
        administrable: 1,
        direccionamiento_Vlan: '192.168.1.10',
        numero_puertos: 24,
        mtto: 1,
        responsabilidad_mantenimiento: 'Propio',
        fecha_mantenimiento_1: new Date('2025-12-01'),
        fecha_mantenimiento_2: null,
        fecha_mantenimiento_3: null,
        fecha_mantenimiento_4: null,
        ingresa_servicios: 1,
        mtto_software: 1,
        id_hospital_fk: 1,
        id_servicio_fk: 6,
        id_tipo_equipo_fk: 2,
        id_usuario_fk: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    console.log('✓ Datos de ejemplo de SysEquipos insertados correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sysequipo', null, {});
  }
};

module.exports = {
  TIPO_MANTENIMIENTO: {
    CORRECTIVO: 1,
    PREVENTIVO: 2,
    PREDICTIVO: 3,
    OTRO: 4
  },

  TIPO_FALLA: {
    DESGASTE: 'Desgaste',
    OPERACION_INDEBIDA: 'Operación Indebida',
    CAUSA_EXTERNA: 'Causa Externa',
    ACCESORIOS: 'Accesorios',
    DESCONOCIDO: 'Desconocido',
    SIN_FALLAS: 'Sin Fallas',
    OTROS: 'Otros',
    NO_REGISTRA: 'No Registra'
  },

  PERIODICIDAD: {
    ANUAL: 1,
    SEMESTRAL: 2,
    TRIMESTRAL: 3,
    CUATRIMESTRAL: 4
  },

  TIPO_EQUIPO_MSV: 9, // ID del tipo de equipo Monitor de Signos Vitales

  ADVANCE_COLORS: {
    VERDE: 1,        // 100%
    AMARILLO_VERDE: 2, // 75-99%
    AMARILLO: 3,     // 50-74%
    NARANJA: 4,      // 25-49%
    ROJO: 5          // 0-24%
  }
};

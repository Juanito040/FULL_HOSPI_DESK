# DIAGRAMA DE ACTIVIDADES - MÓDULO DE MANTENIMIENTO
## Hospital San Rafael - Sistema de Gestión Biomédica

---

## 1. DIAGRAMA PRINCIPAL DE ACTIVIDADES DE MANTENIMIENTO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MÓDULO DE MANTENIMIENTO                              │
│                     Sistema Hospital San Rafael                             │
└─────────────────────────────────────────────────────────────────────────────┘

                                  [INICIO]
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Identificar Necesidad de      │
                    │  Mantenimiento                 │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │ ◇ ¿Tipo de Mantenimiento?     │
                    └─┬────────┬─────────┬──────────┘
                      │        │         │
        ┌─────────────┘        │         └─────────────┐
        │                      │                       │
        ▼                      ▼                       ▼
  [CORRECTIVO]           [PREVENTIVO]            [SISTEMAS]
        │                      │                       │
        │                      │                       │
        ▼                      ▼                       ▼
┌───────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Proceso de    │    │ Proceso de       │    │ Proceso de   │
│ Mantenimiento │    │ Mantenimiento    │    │ Mantenimiento│
│ Correctivo    │    │ Preventivo       │    │ de Sistemas  │
│ (Ver Flujo A) │    │ (Ver Flujo B)    │    │ (Ver Flujo C)│
└───────┬───────┘    └────────┬─────────┘    └──────┬───────┘
        │                      │                     │
        │                      │                     │
        └──────────────┬───────┴─────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Generar Reporte Final       │
        │  - PDF de Actividades        │
        │  - Firmas Digitales          │
        │  - Almacenamiento            │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Actualizar Dashboard        │
        │  e Indicadores KPI           │
        └──────────────┬───────────────┘
                       │
                       ▼
                     [FIN]
```

---

## 2. FLUJO A: MANTENIMIENTO CORRECTIVO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FLUJO DE MANTENIMIENTO CORRECTIVO                        │
│                      (Mantenimiento Reactivo)                                │
└─────────────────────────────────────────────────────────────────────────────┘

                              [INICIO CORRECTIVO]
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Reporte de Falla              │
                    │  - Usuario reporta problema    │
                    │  - Equipo fuera de servicio    │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Registrar Llamado             │
                    │  Campo: hora_llamado           │
                    │  Asignar Técnico               │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Crear REPORTE                 │
                    │  - tipo_mantenimiento = 1      │
                    │  - id_equipo_fk                │
                    │  - fecha actual                │
                    │  - Generar numero_reporte      │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Técnico Llega al Sitio        │
                    │  Campo: hora_inicio            │
                    │  Iniciar cronómetro            │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Diagnóstico de Falla          │
                    │  Seleccionar tipo_falla:       │
                    │  • Desgaste                    │
                    │  • Operación Indebida          │
                    │  • Causa Externa               │
                    │  • Accesorios                  │
                    │  • Desconocido                 │
                    │  • Sin Fallas                  │
                    │  • Otros                       │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │ ◇ ¿Requiere Repuestos?        │
                    └────┬───────────────────────┬───┘
                         │ SÍ                    │ NO
                         ▼                       │
        ┌────────────────────────────┐           │
        │  Registrar Repuestos       │           │
        │  Campo: repuesto_cambiado  │           │
        │  - Descripción             │           │
        │  - Cantidad                │           │
        │  - Referencia              │           │
        └────────────┬───────────────┘           │
                     │                           │
                     └───────────┬───────────────┘
                                 ▼
                ┌────────────────────────────────┐
                │  Realizar Reparación           │
                │  Campo: trabajo_realizado      │
                │  - Descripción detallada       │
                │  - Acciones ejecutadas         │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Pruebas Funcionales           │
                │  - Verificar operación         │
                │  - Calibración (si aplica)     │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ ¿Equipo Funcional?          │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     │                       ▼
                     │        ┌──────────────────────────┐
                     │        │  Registrar Observaciones │
                     │        │  - Equipo no reparable   │
                     │        │  - Requiere terceros     │
                     │        │  - Reemplazo necesario   │
                     │        └────────────┬─────────────┘
                     │                     │
                     └──────────┬──────────┘
                                ▼
                ┌────────────────────────────────┐
                │  Finalizar Trabajo             │
                │  Campo: hora_terminacion       │
                │  Calcular: total_horas         │
                │  Calcular: tiempo_fuera_servicio│
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Registro de Observaciones     │
                │  Campo: observaciones (TEXT)   │
                │  - Condiciones encontradas     │
                │  - Recomendaciones             │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ ¿Equipo en Comodato?        │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     ▼                       ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │  comodato = TRUE    │   │  mtto_propio = TRUE │
        └──────────┬──────────┘   └──────────┬──────────┘
                   │                         │
                   └──────────┬──────────────┘
                              ▼
                ┌────────────────────────────────┐
                │  Firmas de Aprobación          │
                │  - autor_realizado (Técnico)   │
                │  - autor_recibido (Usuario)    │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Generar PDF de Reporte        │
                │  - PdfService                  │
                │  - Guardar en: rutapdf         │
                │  - Path: backend/uploads/      │
                │    reportes/reporte_{id}.pdf   │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Actualizar Estado Equipo      │
                │  - Disponible / No Disponible  │
                │  - Última fecha mantenimiento  │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Actualizar Indicadores        │
                │  - Total correctivos           │
                │  - Por tipo_falla              │
                │  - Tiempo promedio reparación  │
                │  - Equipos críticos            │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                         [FIN CORRECTIVO]
```

---

## 3. FLUJO B: MANTENIMIENTO PREVENTIVO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE MANTENIMIENTO PREVENTIVO                         │
│                      (Mantenimiento Planificado)                             │
└─────────────────────────────────────────────────────────────────────────────┘

                            [INICIO PREVENTIVO]
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Consultar Plan de             │
                    │  Mantenimiento                 │
                    │  - PLANMANTENIMIENTO           │
                    │  - Filtrar por mes/año         │
                    │  - Filtrar por técnico         │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Listar Mantenimientos         │
                    │  Programados                   │
                    │  - MANTENIMIENTO_PREVENTIVO    │
                    │  - WHERE realizado = FALSE     │
                    │  - ORDER BY fecha_realizacion  │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Dashboard Preventivo          │
                    │  - Color por avance:           │
                    │    • Verde (100%)              │
                    │    • Amarillo-Verde (75%)      │
                    │    • Amarillo (50%)            │
                    │    • Naranja (25%)             │
                    │    • Rojo (<25%)               │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Seleccionar Equipo para       │
                    │  Mantenimiento                 │
                    │  - id_equipo_fk                │
                    │  - Datos del equipo            │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Crear Registro de Ejecución   │
                    │  - fecha_realizacion = HOY     │
                    │  - id_usuario_fk = Técnico     │
                    │  - Cargar protocolos           │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │ ◇ ¿Equipo Tipo MSV?           │
                    │   (Monitor Signos Vitales)     │
                    └────┬───────────────────────┬───┘
                         │ SÍ (tipo=9)           │ NO
                         ▼                       │
        ┌────────────────────────────┐           │
        │  Flujo Especializado MSV   │           │
        │  (Ver Sección 4)           │           │
        └────────────┬───────────────┘           │
                     │                           │
                     └───────────┬───────────────┘
                                 ▼
                ┌────────────────────────────────┐
                │  Cargar PROTOCOLO_PREVENTIVO   │
                │  - Lista de pasos (paso)       │
                │  - id_tipo_equipo_fk           │
                │  - cumplimiento inicial = FALSE│
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Ejecutar Protocolo Paso a Paso│
                │  LOOP: Para cada paso          │
                └────────────────┬───────────────┘
                                 │
                        ┌────────▼────────┐
                        │                 │
                        ▼                 │
        ┌────────────────────────────┐    │
        │  Mostrar Paso N            │    │
        │  - Descripción actividad   │    │
        │  - Campos de verificación  │    │
        └────────────┬───────────────┘    │
                     │                    │
                     ▼                    │
        ┌────────────────────────────┐    │
        │  Técnico Ejecuta Paso      │    │
        │  - Realiza actividad       │    │
        │  - Marca cumplimiento      │    │
        └────────────┬───────────────┘    │
                     │                    │
                     ▼                    │
        ┌────────────────────────────┐    │
        │  UPDATE PROTOCOLO_         │    │
        │  PREVENTIVO                │    │
        │  SET cumplimiento = TRUE   │    │
        │  WHERE id = paso_actual    │    │
        └────────────┬───────────────┘    │
                     │                    │
                     ▼                    │
        ┌────────────────────────────┐    │
        │ ◇ ¿Más pasos pendientes?  │    │
        └────┬───────────────────┬───┘    │
             │ SÍ                │ NO     │
             └───────────────────┘        │
                                          │
                                          ▼
                ┌────────────────────────────────┐
                │  Verificar Completitud         │
                │  - % pasos cumplidos           │
                │  - Calcular tiempo_realizacion │
                │  - Generar checkcode           │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ ¿100% Completo?             │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     │                       ▼
                     │        ┌──────────────────────────┐
                     │        │  Registrar Observaciones │
                     │        │  - Pasos no realizables  │
                     │        │  - Problemas encontrados │
                     │        └────────────┬─────────────┘
                     │                     │
                     └──────────┬──────────┘
                                ▼
                ┌────────────────────────────────┐
                │  Crear REPORTE Asociado        │
                │  - tipo_mantenimiento = 2      │
                │  - trabajo_realizado =         │
                │    Resumen de protocolo        │
                │  - Generar numero_reporte      │
                │  - Link: id_reporte_fk         │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ ¿Requirió Repuestos?        │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     ▼                       │
        ┌─────────────────────────┐          │
        │  Registrar en REPORTE   │          │
        │  - repuesto_cambiado    │          │
        │  - Detalles             │          │
        └──────────┬──────────────┘          │
                   │                         │
                   └──────────┬──────────────┘
                              ▼
                ┌────────────────────────────────┐
                │  UPDATE MANTENIMIENTO_         │
                │  PREVENTIVO                    │
                │  SET realizado = TRUE          │
                │  SET id_reporte_fk = {reporte} │
                │  WHERE id = {actual}           │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Generar PDF Preventivo        │
                │  - Listado de protocolos       │
                │  - % cumplimiento              │
                │  - Observaciones               │
                │  - Firmas                      │
                │  - Guardar: rutapdf            │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Actualizar                    │
                │  FECHAMANTENIMIENTOEQUIPOS     │
                │  - fecha_realizada = HOY       │
                │  - estado = "Completado"       │
                │  - Calcular próxima fecha      │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Recalcular Dashboard          │
                │  - % avance mensual            │
                │  - Color indicador             │
                │  - Ranking equipos             │
                │  - Técnicos performance        │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                         [FIN PREVENTIVO]
```

---

## 4. FLUJO ESPECIALIZADO: MONITOR DE SIGNOS VITALES (MSV)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           FLUJO ESPECIALIZADO: MANTENIMIENTO MSV (Tipo Equipo 9)            │
│                    Monitor de Signos Vitales                                │
└─────────────────────────────────────────────────────────────────────────────┘

                            [INICIO MSV]
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Crear MANTENIMIENTO_MSV       │
                │  - Link a equipo tipo 9        │
                │  - Fecha actual                │
                │  - tipo_actividad              │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Checklist de Verificación     │
                │  (Campos BOOLEAN)              │
                └────────────────┬───────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
    ┌─────────┐          ┌──────────┐          ┌──────────┐
    │ ALARMAS │          │ SENSORES │          │  CABLES  │
    │         │          │          │          │          │
    │ ◻ Check │          │ ◻ Check  │          │ ◻ Check  │
    └────┬────┘          └─────┬────┘          └─────┬────┘
         │                     │                     │
         └──────────┬──────────┴──────────┬──────────┘
                    │                     │
          ┌─────────▼─────────┐  ┌────────▼─────────┐
          │     PANTALLA      │  │     BATERÍA      │
          │                   │  │                  │
          │     ◻ Check       │  │     ◻ Check      │
          └─────────┬─────────┘  └────────┬─────────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                ┌────────────────────────────────┐
                │  Validar Checklist Completo    │
                │  - Todos los campos marcados   │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ ¿Todas las verificaciones   │
                │    pasaron exitosamente?       │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     │                       ▼
                     │        ┌──────────────────────────┐
                     │        │  Registrar Observaciones │
                     │        │  Campo: observaciones    │
                     │        │  - Detallar fallos       │
                     │        │  - Acciones tomadas      │
                     │        └────────────┬─────────────┘
                     │                     │
                     └──────────┬──────────┘
                                ▼
                ┌────────────────────────────────┐
                │  SET realizado = TRUE          │
                │  UPDATE MANTENIMIENTO_MSV      │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Continuar con Protocolo       │
                │  General Preventivo            │
                │  (Volver a Flujo B)            │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                            [FIN MSV]
```

---

## 5. FLUJO C: MANTENIMIENTO DE SISTEMAS (SYSMANTENIMIENTO)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  FLUJO DE MANTENIMIENTO DE SISTEMAS                          │
│              (Equipos de Tecnología - Hardware y Software)                   │
└─────────────────────────────────────────────────────────────────────────────┘

                           [INICIO SISTEMAS]
                                  │
                                  ▼
                ┌────────────────────────────────┐
                │  Crear SYSMANTENIMIENTO        │
                │  - id_sysequipo_fk             │
                │  - id_sysusuario_fk (Técnico)  │
                │  - fecha, hora_llamado         │
                │  - numero_reporte              │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Seleccionar Tipo              │
                │  Mantenimiento                 │
                │  - tipo_mantenimiento (1-4)    │
                │  - tipo_falla (+ No Registra)  │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Registrar hora_inicio         │
                │  Iniciar Sesión de Trabajo     │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ ◇ Seleccionar Ruta de Trabajo │
                └────┬───────────────────────┬───┘
                     │                       │
          HARDWARE ──┘                       └── SOFTWARE
                │                                    │
                ▼                                    ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│   FASE DE HARDWARE            │   │   FASE DE SOFTWARE            │
├───────────────────────────────┤   ├───────────────────────────────┤
│                               │   │                               │
│  ┌─────────────────────────┐ │   │  ┌─────────────────────────┐ │
│  │ Diagnóstico Hardware    │ │   │  │ Diagnóstico Software    │ │
│  │ - Componentes físicos   │ │   │  │ - Sistema operativo     │ │
│  │ - Conectividad          │ │   │  │ - Aplicaciones          │ │
│  │ - Periféricos           │ │   │  │ - Configuraciones       │ │
│  └───────────┬─────────────┘ │   │  └───────────┬─────────────┘ │
│              ▼               │   │              ▼               │
│  ┌─────────────────────────┐ │   │  ┌─────────────────────────┐ │
│  │ Ejecutar Rutinas        │ │   │  │ Ejecutar Rutinas        │ │
│  │ Campo: rutinah          │ │   │  │ Campo: rutinas          │ │
│  │ - Limpieza física       │ │   │  │ - Actualización SO      │ │
│  │ - Pruebas de RAM        │ │   │  │ - Antivirus scan        │ │
│  │ - Pruebas de disco      │ │   │  │ - Limpieza temporal     │ │
│  │ - Verificación térmica  │ │   │  │ - Optimización registry │ │
│  └───────────┬─────────────┘ │   │  └───────────┬─────────────┘ │
│              ▼               │   │              ▼               │
│  ┌─────────────────────────┐ │   │  ┌─────────────────────────┐ │
│  │ Mantenimiento Realizado │ │   │  │ Mantenimiento Realizado │ │
│  │ Campo: mphardware (TEXT)│ │   │  │ Campo: mpsoftware (TEXT)│ │
│  │ - Descripción detallada │ │   │  │ - Descripción detallada │ │
│  │ - Componentes trabajados│ │   │  │ - Apps instaladas       │ │
│  └───────────┬─────────────┘ │   │  └───────────┬─────────────┘ │
│              ▼               │   │              ▼               │
│  ┌─────────────────────────┐ │   │  ┌─────────────────────────┐ │
│  │ Observaciones Hardware  │ │   │  │ Observaciones Software  │ │
│  │ Campo: observacionesh   │ │   │  │ Campo: observacioness   │ │
│  │ - Estado final          │ │   │  │ - Estado final          │ │
│  │ - Recomendaciones       │ │   │  │ - Recomendaciones       │ │
│  └───────────┬─────────────┘ │   │  └───────────┬─────────────┘ │
│              ▼               │   │              ▼               │
│  ┌─────────────────────────┐ │   │  ┌─────────────────────────┐ │
│  │ Generar PDF Hardware    │ │   │  │ Generar PDF Software    │ │
│  │ Campo: rutahardware     │ │   │  │ Campo: rutasoftware     │ │
│  │ - Formato específico    │ │   │  │ - Formato específico    │ │
│  └───────────┬─────────────┘ │   │  └───────────┬─────────────┘ │
│              │               │   │              │               │
└──────────────┼───────────────┘   └──────────────┼───────────────┘
               │                                  │
               └──────────────┬───────────────────┘
                              ▼
                ┌────────────────────────────────┐
                │ ◇ ¿Se registró daño físico?   │
                └────┬───────────────────────┬───┘
                     │ SÍ                    │ NO
                     ▼                       │
        ┌─────────────────────────┐          │
        │  Documentar Daño        │          │
        │  Campo: dano (TEXT)     │          │
        │  - Descripción detallada│          │
        │  - Fotos/evidencias     │          │
        └──────────┬──────────────┘          │
                   │                         │
                   └──────────┬──────────────┘
                              ▼
                ┌────────────────────────────────┐
                │  Registrar hora_terminacion    │
                │  Calcular: total_horas         │
                │  Calcular: tiempo_fuera_servicio│
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Preparar Entrega del Equipo   │
                │  Campo: entrega (TEXT)         │
                │  - Estado final                │
                │  - Configuración aplicada      │
                │  - Instrucciones usuario       │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Generar PDF de Entrega        │
                │  Campo: rutaentrega            │
                │  - Checklist final             │
                │  - Condiciones                 │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Firmas de Recepción           │
                │  - autor_realizado (Técnico)   │
                │  - autor_recibido (Usuario)    │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │  Actualizar Dashboard Sistemas │
                │  - Total mantenimientos/tipo   │
                │  - Equipos críticos ranking    │
                │  - Tiempo fuera servicio total │
                │  - Performance técnicos        │
                └────────────────┬───────────────┘
                                 │
                                 ▼
                          [FIN SISTEMAS]
```

---

## 6. PROCESO DE GENERACIÓN DE INDICADORES Y DASHBOARD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GENERACIÓN DE INDICADORES Y KPIs                          │
│                         (Post-Mantenimiento)                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                              [INICIO KPI]
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  Consulta de Datos Agregados   │
                  │  Parámetros:                   │
                  │  - fecha_inicio                │
                  │  - fecha_fin                   │
                  │  - id_tecnico (opcional)       │
                  └────────────────┬───────────────┘
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  Calcular Estadísticas por Tipo│
                  └────────────────┬───────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  CORRECTIVOS  │         │  PREVENTIVOS  │         │   SISTEMAS    │
├───────────────┤         ├───────────────┤         ├───────────────┤
│ COUNT(tipo=1) │         │ COUNT(tipo=2) │         │ COUNT from    │
│ from REPORTE  │         │ from REPORTE  │         │ SYSMANTENIMIENTO│
└───────┬───────┘         └───────┬───────┘         └───────┬───────┘
        │                         │                         │
        └─────────────┬───────────┴─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────┐
        │  Calcular Estadísticas por Falla│
        └─────────────┬───────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┬──────────┐
        ▼             ▼             ▼             ▼          ▼
    ┌────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐   ┌────────┐
    │Desgaste│   │ Op.     │   │ Causa   │   │Acceso- │   │Otros   │
    │        │   │Indebida │   │Externa  │   │rios    │   │        │
    └────┬───┘   └────┬────┘   └────┬────┘   └───┬────┘   └───┬────┘
         │            │             │             │            │
         └────────────┴──────┬──────┴─────────────┴────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │  Calcular Métricas de Tiempo        │
        │  - AVG(total_horas)                 │
        │  - SUM(tiempo_fuera_servicio)       │
        │  - Tiempo promedio respuesta        │
        │    (hora_inicio - hora_llamado)     │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  Ranking de Equipos                 │
        │  - TOP 10 con más mantenimientos    │
        │  - Equipos críticos                 │
        │  - Frecuencia por tipo_equipo       │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  Performance de Técnicos            │
        │  - Mantenimientos completados       │
        │  - Tiempo promedio por técnico      │
        │  - % cumplimiento preventivo        │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  Cálculo de Color de Avance         │
        │  (Solo Preventivo)                  │
        │  - Total programados mes actual     │
        │  - Total realizados                 │
        │  - % = (realizados/programados)*100 │
        │                                     │
        │  IF % >= 100  → VERDE (1)           │
        │  IF % >= 75   → AMARILLO-VERDE (2)  │
        │  IF % >= 50   → AMARILLO (3)        │
        │  IF % >= 25   → NARANJA (4)         │
        │  IF % < 25    → ROJO (5)            │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  Generar JSON Dashboard Response    │
        │  {                                  │
        │    totalCorrectivos: N,             │
        │    totalPreventivos: N,             │
        │    totalPredictivos: N,             │
        │    totalOtros: N,                   │
        │    porTipoFalla: {...},             │
        │    tiempoPromedioReparacion: X,     │
        │    equiposCriticos: [...],          │
        │    avanceMensual: {                 │
        │      porcentaje: X,                 │
        │      color: Y,                      │
        │      realizados: N,                 │
        │      programados: M                 │
        │    }                                │
        │  }                                  │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │  Actualizar Dashboard Frontend      │
        │  - Gráficos de barras               │
        │  - Indicadores numéricos            │
        │  - Tablas de equipos                │
        │  - Color coding visual              │
        └─────────────┬───────────────────────┘
                      │
                      ▼
                  [FIN KPI]
```

---

## 7. DIAGRAMA DE ESTADOS DEL EQUIPO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MÁQUINA DE ESTADOS: EQUIPO                                │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌───────────────┐
                         │  DISPONIBLE   │
                         │   (Operativo) │
                         └───────┬───────┘
                                 │
                     ┌───────────┼───────────┐
                     │                       │
         [Mantenimiento           [Falla Reportada]
          Preventivo                       │
          Programado]                      │
                     │                     │
                     ▼                     ▼
          ┌──────────────────┐   ┌──────────────────┐
          │ EN MANTENIMIENTO │   │   FUERA DE       │
          │   PREVENTIVO     │   │   SERVICIO       │
          │                  │   │                  │
          │ tiempo_realizacion│   │ tiempo_fuera_   │
          │ en ejecución     │   │ servicio++       │
          └────────┬─────────┘   └────────┬─────────┘
                   │                      │
                   │                      │
          [Completado]          [Mantenimiento Correctivo]
                   │                      │
                   │                      ▼
                   │            ┌──────────────────┐
                   │            │ EN REPARACIÓN    │
                   │            │                  │
                   │            │ trabajo_realizado│
                   │            │ en proceso       │
                   │            └────────┬─────────┘
                   │                     │
                   │                     │
                   │           ┌─────────┴─────────┐
                   │           │                   │
                   │    [Reparado]          [No Reparable]
                   │           │                   │
                   │           ▼                   ▼
                   │  ┌──────────────┐   ┌──────────────────┐
                   └─→│  DISPONIBLE  │   │ REQUIERE TERCEROS│
                      │              │   │ / REEMPLAZO      │
                      └──────────────┘   └──────────────────┘
```

---

## 8. INTERACCIÓN ENTRE COMPONENTES DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              ARQUITECTURA DE COMPONENTES - MÓDULO MANTENIMIENTO              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   mantenimiento  │  │ sysmantenimiento │  │  Dashboard KPI   │          │
│  │      .html       │  │      .html       │  │      .html       │          │
│  │                  │  │                  │  │                  │          │
│  │ - Formularios    │  │ - Dual pathway   │  │ - Gráficos       │          │
│  │ - Protocolo UI   │  │ - HW/SW tabs     │  │ - Indicadores    │          │
│  │ - Calendario     │  │ - PDF viewer     │  │ - Color coding   │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                     │                    │
└───────────┼─────────────────────┼─────────────────────┼────────────────────┘
            │                     │                     │
            │ HTTP/REST           │ HTTP/REST           │ HTTP/REST
            │                     │                     │
┌───────────▼─────────────────────▼─────────────────────▼────────────────────┐
│                          CAPA DE CONTROLADORES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  MantenimientoController.java / mantenimiento.controller.js          │   │
│  │                                                                      │   │
│  │  POST /mantenimiento              → obtenermtto()                   │   │
│  │  GET  /mantenimiento/preventivos  → getPreventivos()                │   │
│  │  GET  /mantenimiento/dashboard    → getDashboard()                  │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  SysMantenimientoController.java / sysmantenimiento.controller.js    │   │
│  │                                                                      │   │
│  │  POST /sysmantenimiento           → create()                        │   │
│  │  GET  /sysmantenimiento/dashboard → getDashboard()                  │   │
│  │  GET  /sysmantenimiento/estadisticas → getEstadisticas()            │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      │ Llama a
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                          CAPA DE SERVICIOS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  mantenimiento.service.js                                            │   │
│  │                                                                      │   │
│  │  - findByFecha(mes, ano)                                            │   │
│  │  - findByTecnico(idUsuario, mes, ano)                               │   │
│  │  - getIndicadores(fechaInicio, fechaFin)                            │   │
│  │  - calcularEstadisticas(mantenimientos, diaInicio, diaFin)          │   │
│  │  - contarPorTipo(tipo, fechaInicio, fechaFin)                       │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  sysmantenimiento.service.js                                         │   │
│  │                                                                      │   │
│  │  - create(data)                                                     │   │
│  │  - findAll(filters)                                                 │   │
│  │  - getDashboard(fechaInicio, fechaFin)                              │   │
│  │  - getEstadisticasPorTipo(fechaInicio, fechaFin)                    │   │
│  │  - getEquiposConMasMantenimientos(limite, fechaInicio, fechaFin)    │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  PdfService / PdfGenerator                                           │   │
│  │                                                                      │   │
│  │  - generarReporteMantenimiento(reporte)                             │   │
│  │  - generarReporteSistemas(sysmantenimiento, tipo)                   │   │
│  │  - almacenarEnRuta(pdf, rutapdf)                                    │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                       │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      │ Accede a
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                         CAPA DE MODELOS/DAOs                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐    │
│  │MANTENIMIENTO_   │  │    REPORTE       │  │ PROTOCOLO_PREVENTIVO    │    │
│  │  PREVENTIVO     │  │                  │  │                         │    │
│  │  .model.js      │  │  .model.js       │  │  .model.js              │    │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬────────────────┘    │
│           │                    │                     │                      │
│  ┌────────▼────────┐  ┌────────▼─────────┐  ┌───────▼──────────────────┐   │
│  │ SYSMANTENIMIENTO│  │MANTENIMIENTO_MSV │  │FECHAMANTENIMIENTOEQUIPOS │   │
│  │   .model.js     │  │   .model.js      │  │      .model.js           │   │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬──────────────────┘   │
│           │                    │                     │                      │
└───────────┼────────────────────┼─────────────────────┼──────────────────────┘
            │                    │                     │
            │                    │                     │
            │      Mapean a Tablas en Base de Datos   │
            │                    │                     │
┌───────────▼────────────────────▼─────────────────────▼──────────────────────┐
│                         CAPA DE PERSISTENCIA                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                           MySQL Database                                     │
│                                                                              │
│  Tables:                                                                     │
│  - mantenimiento_preventivo                                                  │
│  - reporte                                                                   │
│  - sysmantenimiento                                                          │
│  - protocolo_preventivo                                                      │
│  - mantenimiento_msv                                                         │
│  - fechamantenimientoequipos                                                 │
│  - equipo, sysequipo, tipo_equipo, usuario, servicio                         │
│                                                                              │
│  Relationships:                                                              │
│  - MANTENIMIENTO_PREVENTIVO → EQUIPO (M:1)                                   │
│  - MANTENIMIENTO_PREVENTIVO → REPORTE (1:1)                                  │
│  - PROTOCOLO_PREVENTIVO → MANTENIMIENTO_PREVENTIVO (M:1)                     │
│  - SYSMANTENIMIENTO → SYSEQUIPO (M:1)                                        │
│  - MANTENIMIENTO_MSV → EQUIPO (M:1)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. MATRIZ DE RESPONSABILIDADES

| **Actor/Rol**          | **Responsabilidad**                                      |
|------------------------|----------------------------------------------------------|
| **Técnico Biomédico**  | - Ejecutar mantenimiento preventivo y correctivo         |
|                        | - Completar protocolos paso a paso                       |
|                        | - Registrar trabajo_realizado y repuestos                |
|                        | - Generar firmas de realización                          |
|------------------------|----------------------------------------------------------|
| **Técnico de Sistemas**| - Mantenimiento HW/SW de equipos tecnológicos            |
|                        | - Ejecutar rutinas de hardware y software                |
|                        | - Documentar daños y entregas                            |
|                        | - Generar PDFs duales (HW/SW)                            |
|------------------------|----------------------------------------------------------|
| **Usuario Final**      | - Reportar fallas de equipos                             |
|                        | - Recibir equipos post-mantenimiento                     |
|                        | - Firmar conformidad de recepción (autor_recibido)       |
|------------------------|----------------------------------------------------------|
| **Sistema Automático** | - Generar planes de mantenimiento mensual                |
|                        | - Calcular % avance y color coding                       |
|                        | - Actualizar dashboard en tiempo real                    |
|                        | - Generar reportes PDF automáticamente                   |
|                        | - Calcular métricas KPI                                  |
|------------------------|----------------------------------------------------------|

---

## 10. LEYENDA DE SÍMBOLOS UML

```
SÍMBOLOS UTILIZADOS EN LOS DIAGRAMAS:

[INICIO]                  → Estado inicial del flujo
[FIN]                     → Estado final del flujo

┌────────────────┐
│  Actividad     │        → Acción o proceso a ejecutar
└────────────────┘

┌────────────────┐
│ ◇ ¿Decisión?  │        → Punto de decisión (rombo)
└────┬───────┬───┘
     │ SÍ    │ NO        → Ramas de decisión

     │
     ▼                   → Flujo de control

┌────────────────┐
│ LOOP: ...      │        → Estructura iterativa
└────────────────┘

┌────────────────────────────────────────┐
│  FASE O SUBPROCESO                     │
│  (Ver Sección X)                       │   → Referencia a otro flujo
└────────────────────────────────────────┘

Campo: nombre_campo      → Campo de base de datos
FK: foreign_key          → Llave foránea
```

---

## 11. NOTAS TÉCNICAS

### 11.1 Cálculo de Tiempos
```sql
-- Total de horas de mantenimiento
total_horas = TIMESTAMPDIFF(HOUR, hora_inicio, hora_terminacion)

-- Tiempo fuera de servicio (en minutos)
tiempo_fuera_servicio = TIMESTAMPDIFF(MINUTE, hora_llamado, hora_terminacion)
```

### 11.2 Generación de Número de Reporte
```javascript
// Formato: MTTO-YYYYMMDD-XXXX
// Ejemplo: MTTO-20250105-0001
numero_reporte = `MTTO-${fechaFormateada}-${secuencial.padStart(4, '0')}`
```

### 11.3 Almacenamiento de PDFs
```
Estructura de directorios:
backend/uploads/
├── reportes/
│   ├── reporte_1.pdf
│   ├── reporte_2.pdf
│   └── ...
├── hardware/
│   ├── hw_report_1.pdf
│   └── ...
├── software/
│   ├── sw_report_1.pdf
│   └── ...
└── entrega/
    ├── entrega_1.pdf
    └── ...
```

### 11.4 Color de Avance - Fórmula
```javascript
function calcularColorAvance(realizados, programados) {
  const porcentaje = (realizados / programados) * 100;

  if (porcentaje >= 100) return { color: 'VERDE', codigo: 1 };
  if (porcentaje >= 75)  return { color: 'AMARILLO-VERDE', codigo: 2 };
  if (porcentaje >= 50)  return { color: 'AMARILLO', codigo: 3 };
  if (porcentaje >= 25)  return { color: 'NARANJA', codigo: 4 };
  return { color: 'ROJO', codigo: 5 };
}
```

---

## 12. ENDPOINTS API - RESUMEN

### Node.js Backend

#### Mantenimiento Preventivo
```
GET    /api/mantenimiento                      → Dashboard actual
POST   /api/mantenimiento/filtrar              → Filtrar por fecha/técnico
GET    /api/mantenimiento/preventivos/:mes/:ano → Por mes/año
GET    /api/mantenimiento/tecnicos             → Lista técnicos
```

#### Mantenimiento de Sistemas
```
GET    /api/sysmantenimiento                    → Listar todos (filtrable)
POST   /api/sysmantenimiento                    → Crear nuevo
GET    /api/sysmantenimiento/:id                → Obtener por ID
PUT    /api/sysmantenimiento/:id                → Actualizar
DELETE /api/sysmantenimiento/:id                → Eliminar
GET    /api/sysmantenimiento/dashboard          → Dashboard sistemas
GET    /api/sysmantenimiento/estadisticas/tipo  → Estadísticas por tipo
GET    /api/sysmantenimiento/estadisticas/falla → Estadísticas por falla
GET    /api/sysmantenimiento/equipo/:idEquipo   → Por equipo
GET    /api/sysmantenimiento/tecnico/:idUsuario → Por técnico
```

---

## CONCLUSIÓN

Este diagrama de actividades documenta de manera integral los tres flujos principales de mantenimiento en el sistema Hospital San Rafael:

1. **Mantenimiento Correctivo**: Flujo reactivo ante fallas
2. **Mantenimiento Preventivo**: Flujo planificado con protocolos
3. **Mantenimiento de Sistemas**: Flujo dual HW/SW para tecnología

Cada flujo está diseñado para garantizar:
- ✅ Trazabilidad completa de actividades
- ✅ Registro preciso de tiempos y recursos
- ✅ Generación automática de reportes PDF
- ✅ Actualización en tiempo real de indicadores
- ✅ Cumplimiento de estándares de calidad hospitalaria

---

**Fecha de Creación**: 2025-12-05
**Versión**: 1.0
**Autor**: Documentación Técnica - Sistema Hospital San Rafael

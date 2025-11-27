# Módulo de Mantenimiento - Hospital San Rafael

## Descripción
Módulo completo para la gestión de mantenimientos preventivos, correctivos y predictivos de equipos médicos e industriales del Hospital San Rafael.

## Estructura del Módulo

```
src/
├── models/sequelize/
│   ├── mantenimientoPreventivo.model.js ✓
│   ├── reporte.model.js ✓
│   ├── protocoloPreventivo.model.js ✓
│   └── mantenimientoMSV.model.js ✓
├── controllers/
│   ├── mantenimiento.controller.js ✓
│   └── reporte.controller.js ✓
├── services/
│   ├── mantenimiento.service.js ✓
│   └── reporte.service.js ✓
├── routes/
│   ├── mantenimiento.routes.js ✓
│   └── reporte.routes.js ✓
├── middlewares/validators/
│   ├── mantenimiento.validator.js ✓
│   └── reporte.validator.js ✓
└── utils/
    ├── constants.js ✓
    └── dateHelpers.js ✓
```

## Funcionalidades Implementadas

### 1. Mantenimiento
- ✅ Dashboard de mantenimientos con estadísticas del mes actual
- ✅ Filtrado de mantenimientos por rango de fechas y técnico
- ✅ Consulta de mantenimientos preventivos por mes/año
- ✅ Listado de técnicos disponibles
- ✅ Cálculo automático de estadísticas y avances
- ✅ Indicadores de mantenimientos por tipo y falla

### 2. Reportes
- ✅ Crear nuevo reporte de mantenimiento
- ✅ Obtener reporte por ID
- ✅ Actualizar reporte existente
- ✅ Eliminar reporte
- ✅ Listar reportes por equipo
- ✅ Cálculo automático de horas totales

## Endpoints Disponibles

### Mantenimiento

#### GET /api/mantenimiento
Obtiene el dashboard de mantenimientos del mes actual

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "hechos": 15,
    "sinRealizar": 5,
    "tiempoTotal": 300,
    "tiempoRealizado": 225,
    "tiempoFaltante": 75,
    "porcentaje": 75,
    "advanceColor": 2,
    "indicadores": { ... },
    "mantenimientos": [...],
    "tecnicos": [...],
    "totalmtto": 20
  }
}
```

#### POST /api/mantenimiento/filtrar
Filtra mantenimientos por rango de fechas y técnico

**Body:**
```json
{
  "daterange": "01/01/2025 - 01/31/2025",
  "usuarioprogramado": 1
}
```

#### GET /api/mantenimiento/preventivos/:mes/:ano
Obtiene mantenimientos preventivos por mes y año

**Parámetros:**
- `mes`: Mes (1-12)
- `ano`: Año (ej: 2025)

#### GET /api/mantenimiento/tecnicos
Obtiene la lista de técnicos disponibles

### Reportes

#### POST /api/reportes
Crea un nuevo reporte de mantenimiento

**Body:**
```json
{
  "idEquipo": 1,
  "fecha": "2025-01-20",
  "horaLlamado": "08:00",
  "horaInicio": "08:30",
  "horaTerminacion": "10:00",
  "tipoMantenimiento": 1,
  "tipoFalla": "Desgaste",
  "trabajoRealizado": "Limpieza y calibración",
  "motivo": "Mantenimiento preventivo programado",
  "observaciones": "Equipo funcionando correctamente",
  "mantenimientoPropio": true,
  "nombreRecibio": "Juan Pérez",
  "cedulaRecibio": "1234567890"
}
```

#### GET /api/reportes/:id
Obtiene un reporte específico por ID

#### PUT /api/reportes/:id
Actualiza un reporte existente

#### DELETE /api/reportes/:id
Elimina un reporte

#### GET /api/reportes/equipo/:idEquipo
Obtiene todos los reportes de un equipo

## Tipos de Mantenimiento

```javascript
TIPO_MANTENIMIENTO: {
  CORRECTIVO: 1,
  PREVENTIVO: 2,
  PREDICTIVO: 3,
  OTRO: 4
}
```

## Tipos de Falla

```javascript
TIPO_FALLA: {
  DESGASTE: 'Desgaste',
  OPERACION_INDEBIDA: 'Operación Indebida',
  CAUSA_EXTERNA: 'Causa Externa',
  ACCESORIOS: 'Accesorios',
  DESCONOCIDO: 'Desconocido',
  SIN_FALLAS: 'Sin Fallas',
  OTROS: 'Otros',
  NO_REGISTRA: 'No Registra'
}
```

## Colores de Avance

```javascript
ADVANCE_COLORS: {
  VERDE: 1,        // 100%
  AMARILLO_VERDE: 2, // 75-99%
  AMARILLO: 3,     // 50-74%
  NARANJA: 4,      // 25-49%
  ROJO: 5          // 0-24%
}
```

## Validaciones

### Mantenimiento
- `daterange`: Formato MM/DD/YYYY - MM/DD/YYYY (requerido)
- `usuarioprogramado`: ID de usuario (opcional, entero)
- `mes`: Entre 1 y 12 (requerido)
- `ano`: Entre 2000 y 2100 (requerido)

### Reporte
- `idEquipo`: ID del equipo (requerido, entero)
- `fecha`: Fecha válida (requerida)
- `horaInicio`: Formato HH:MM (requerida)
- `horaTerminacion`: Formato HH:MM (requerida)
- `tipoMantenimiento`: Entre 1 y 4 (requerido)
- `trabajoRealizado`: Texto (opcional)
- `observaciones`: Texto (opcional)

## Uso de la Colección de Postman

1. Importa el archivo `postman/Hospital_San_Rafael_Mantenimiento.postman_collection.json` en Postman
2. Configura la variable de entorno `{{base_url}}` con el valor `http://localhost:3000`
3. Ejecuta los endpoints según necesites

## Ejemplos de Uso

### Filtrar mantenimientos del mes actual
```bash
curl -X POST http://localhost:3000/api/mantenimiento/filtrar \
  -H "Content-Type: application/json" \
  -d '{"daterange": "01/01/2025 - 01/31/2025", "usuarioprogramado": 1}'
```

### Crear un reporte de mantenimiento correctivo
```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "idEquipo": 1,
    "fecha": "2025-01-20",
    "horaInicio": "08:30",
    "horaTerminacion": "10:00",
    "tipoMantenimiento": 1,
    "trabajoRealizado": "Reparación de componente"
  }'
```

### Obtener reportes de un equipo específico
```bash
curl http://localhost:3000/api/reportes/equipo/1
```

## Dependencias Instaladas

```json
{
  "pdfkit": "^0.15.0",
  "pdf-lib": "^1.17.1",
  "@pdf-lib/fontkit": "^1.1.1",
  "express-validator": "^7.0.1"
}
```

## Próximas Mejoras Sugeridas

1. Implementar generación de PDFs de reportes
2. Agregar autenticación y autorización
3. Implementar paginación en los listados
4. Agregar filtros avanzados
5. Implementar notificaciones por email
6. Agregar exportación a Excel
7. Implementar cache con Redis
8. Agregar tests unitarios
9. Implementar logs con Winston
10. Agregar gráficos estadísticos

## Soporte

Para cualquier duda o problema:
- Revisa la documentación de las instrucciones originales
- Consulta la colección de Postman
- Verifica los modelos de datos en `src/models/sequelize/`

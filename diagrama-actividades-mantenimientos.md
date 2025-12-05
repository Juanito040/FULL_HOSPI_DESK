# Diagrama de Actividades - Módulo de Mantenimientos

## Descripción
Este diagrama muestra el flujo de actividades para el módulo de gestión de mantenimientos de equipos del sistema Hospital San Rafael.

## Diagrama en formato Mermaid

```mermaid
flowchart TD
    Start([Usuario accede al módulo de Mantenimientos]) --> LoadCatalogos[Cargar catálogos desde backend]
    LoadCatalogos --> TiposMantenimiento{¿Catálogos cargados?}
    TiposMantenimiento -->|Sí| LoadMantenimientos[Cargar lista de mantenimientos]
    TiposMantenimiento -->|No| UsarLocal[Usar catálogos locales como fallback]
    UsarLocal --> LoadMantenimientos

    LoadMantenimientos --> ShowList[Mostrar lista de mantenimientos]
    ShowList --> UserAction{Acción del usuario}

    UserAction -->|Filtrar| ApplyFilters[Aplicar filtros]
    ApplyFilters --> FilterOptions{Tipo de filtro}
    FilterOptions -->|Por tipo| FilterTipo[Filtrar por tipo de mantenimiento]
    FilterOptions -->|Por falla| FilterFalla[Filtrar por tipo de falla]
    FilterOptions -->|Por búsqueda| FilterSearch[Buscar por texto]
    FilterTipo --> ShowList
    FilterFalla --> ShowList
    FilterSearch --> ShowList

    UserAction -->|Ver Dashboard| LoadDashboard[Cargar estadísticas]
    LoadDashboard --> SelectDateRange{¿Rango de fechas?}
    SelectDateRange -->|Proporcionado| UseDates[Usar fechas proporcionadas]
    SelectDateRange -->|No proporcionado| UseCurrentMonth[Usar mes actual]
    UseDates --> GetStats[Obtener estadísticas del backend]
    UseCurrentMonth --> GetStats
    GetStats --> ShowDashboard[Mostrar dashboard con gráficos]
    ShowDashboard --> ShowList

    UserAction -->|Crear nuevo| ShowForm[Mostrar formulario de creación]
    ShowForm --> FillData[Usuario llena datos del mantenimiento]
    FillData --> ValidateForm{¿Formulario válido?}
    ValidateForm -->|No| ShowError1[Mostrar errores de validación]
    ShowError1 --> FillData
    ValidateForm -->|Sí| PrepareData[Preparar datos para envío]
    PrepareData --> SendCreate[Enviar POST al backend]
    SendCreate --> CreateSuccess{¿Creación exitosa?}
    CreateSuccess -->|No| ShowError2[Mostrar notificación de error]
    ShowError2 --> ShowForm
    CreateSuccess -->|Sí| ShowSuccess1[Mostrar notificación de éxito]
    ShowSuccess1 --> LoadMantenimientos

    UserAction -->|Ver detalle| GetById[Obtener mantenimiento por ID]
    GetById --> DetailExists{¿Existe?}
    DetailExists -->|No| Show404[Mostrar error 404]
    Show404 --> ShowList
    DetailExists -->|Sí| ShowDetail[Mostrar detalle del mantenimiento]
    ShowDetail --> DetailAction{Acción en detalle}

    DetailAction -->|Editar| ShowEditForm[Mostrar formulario de edición]
    ShowEditForm --> FillEditData[Usuario modifica datos]
    FillEditData --> ValidateEdit{¿Formulario válido?}
    ValidateEdit -->|No| ShowError3[Mostrar errores de validación]
    ShowError3 --> FillEditData
    ValidateEdit -->|Sí| PrepareUpdate[Preparar datos de actualización]
    PrepareUpdate --> SendUpdate[Enviar PUT al backend]
    SendUpdate --> UpdateSuccess{¿Actualización exitosa?}
    UpdateSuccess -->|No| ShowError4[Mostrar notificación de error]
    ShowError4 --> ShowEditForm
    UpdateSuccess -->|Sí| ShowSuccess2[Mostrar notificación de éxito]
    ShowSuccess2 --> LoadMantenimientos

    DetailAction -->|Eliminar| ConfirmDelete{¿Confirmar eliminación?}
    ConfirmDelete -->|No| ShowDetail
    ConfirmDelete -->|Sí| SendDelete[Enviar DELETE al backend]
    SendDelete --> DeleteSuccess{¿Eliminación exitosa?}
    DeleteSuccess -->|No| ShowError5[Mostrar notificación de error]
    ShowError5 --> ShowDetail
    DeleteSuccess -->|Sí| ShowSuccess3[Mostrar notificación de éxito]
    ShowSuccess3 --> LoadMantenimientos

    DetailAction -->|Ver equipo| GoToEquipo[Navegar a detalle del equipo]
    GoToEquipo --> End1([Fin - Fuera del flujo])

    DetailAction -->|Regresar| ShowList

    UserAction -->|Salir| End2([Fin])

    style Start fill:#4c87c6
    style End1 fill:#4c87c6
    style End2 fill:#4c87c6
    style ShowSuccess1 fill:#22c55e
    style ShowSuccess2 fill:#22c55e
    style ShowSuccess3 fill:#22c55e
    style ShowError1 fill:#ef4444
    style ShowError2 fill:#ef4444
    style ShowError3 fill:#ef4444
    style ShowError4 fill:#ef4444
    style ShowError5 fill:#ef4444
    style Show404 fill:#f59e0b
```

## Descripción de Actividades Principales

### 1. Cargar Módulo
- El usuario accede al módulo de mantenimientos
- Se cargan automáticamente los catálogos (tipos de mantenimiento y tipos de falla)
- Se muestra la lista de mantenimientos

### 2. Filtrar Mantenimientos
- **Por tipo de mantenimiento**: Correctivo, Preventivo, Predictivo, Otro
- **Por tipo de falla**: Desgaste, Operación Indebida, Causa Externa, etc.
- **Por búsqueda**: Texto libre en múltiples campos

### 3. Ver Dashboard
- Muestra estadísticas de mantenimientos
- Permite seleccionar rango de fechas
- Por defecto muestra el mes actual
- Incluye gráficos y contadores

### 4. Crear Mantenimiento
**Campos principales:**
- Número de reporte
- Fecha y horas (llamado, inicio, terminación)
- Tipo de mantenimiento
- Tipo de falla
- Equipo asociado
- Actividades realizadas
- Observaciones
- Técnico responsable

**Validaciones:**
- Campos requeridos
- Formatos de fecha y hora
- Relación con equipo existente

### 5. Editar Mantenimiento
- Cargar datos existentes
- Permitir modificación
- Validar cambios
- Actualizar en base de datos

### 6. Eliminar Mantenimiento
- Solicitar confirmación
- Eliminar de base de datos
- Actualizar lista

### 7. Ver Detalle
- Mostrar información completa
- Ver equipo asociado
- Acceso a edición y eliminación

## Roles y Permisos
- **Administrador**: Acceso completo (crear, editar, eliminar, ver)
- **Supervisor**: Puede ver y editar, no eliminar
- **Técnico**: Solo puede ver y crear

## Notificaciones
- **Éxito**: Verde - Operación completada
- **Error**: Rojo - Operación fallida
- **Advertencia**: Naranja - Validaciones o confirmaciones
- **Info**: Azul - Información general

## Endpoints del Backend

### GET
- `GET /api/sysmantenimiento` - Listar todos con filtros
- `GET /api/sysmantenimiento/:id` - Obtener por ID
- `GET /api/sysmantenimiento/equipo/:idEquipo` - Por equipo
- `GET /api/sysmantenimiento/dashboard` - Estadísticas

### POST
- `POST /api/sysmantenimiento` - Crear nuevo

### PUT
- `PUT /api/sysmantenimiento/:id` - Actualizar

### DELETE
- `DELETE /api/sysmantenimiento/:id` - Eliminar

## Estados del Componente

```typescript
// Estados principales
isLoading: boolean       // Indicador de carga
error: string | null     // Mensaje de error
mantenimientos: []       // Lista de mantenimientos
filteredMantenimientos:  // Lista filtrada
selectedTipo: number     // Filtro por tipo
selectedFalla: number    // Filtro por falla
searchTerm: string       // Término de búsqueda
```

## Flujo de Datos

```
Frontend Component
    ↓
MantenimientosService
    ↓
HTTP Request
    ↓
Backend API
    ↓
SysMantenimientoController
    ↓
SysMantenimientoService
    ↓
Sequelize Model
    ↓
Base de Datos
```

---

**Generado para**: Hospital San Rafael - Sistema de Gestión de Mantenimientos
**Fecha**: Diciembre 2025
**Versión**: 1.0

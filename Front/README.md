# Hospital San Rafael - Sistema de Gestión Frontend

Sistema de gestión para el Hospital San Rafael desarrollado con Angular 17 utilizando componentes standalone.

## Características

- **Dashboard**: Panel principal con métricas y estadísticas rápidas
- **Gestión de Equipos**: Administración completa de equipos de sistemas
- **Gestión de Mantenimientos**: Registro y seguimiento de mantenimientos
- **Indicadores**: Visualización de estadísticas y métricas del sistema

## Tecnologías

- Angular 17 (Standalone Components)
- TypeScript
- RxJS
- HttpClient para consumo de API REST

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Backend del Hospital San Rafael ejecutándose (puerto 3000)

## Instalación

1. Navega a la carpeta del frontend:
```bash
cd Front
```

2. Instala las dependencias:
```bash
npm install
```

## Configuración

### Variables de Entorno

El proyecto utiliza archivos de entorno para configurar la URL de la API:

- **Desarrollo**: `src/environments/environment.ts`
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
  };
  ```

- **Producción**: `src/environments/environment.prod.ts`
  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'https://tu-servidor-produccion.com/api'
  };
  ```

## Ejecución

### Modo Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm start
```

O alternativamente:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Compilación para Producción

Genera los archivos optimizados para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Estructura del Proyecto

```
Front/
├── src/
│   ├── app/
│   │   ├── components/        # Componentes reutilizables
│   │   │   └── navbar/        # Barra de navegación
│   │   ├── pages/             # Páginas principales
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   ├── equipos/       # Gestión de equipos
│   │   │   ├── mantenimientos/ # Gestión de mantenimientos
│   │   │   └── indicadores/   # Estadísticas e indicadores
│   │   ├── services/          # Servicios para API
│   │   │   ├── equipos.service.ts
│   │   │   ├── mantenimientos.service.ts
│   │   │   └── indicadores.service.ts
│   │   ├── app.component.ts   # Componente raíz
│   │   ├── app.config.ts      # Configuración de la app
│   │   └── app.routes.ts      # Definición de rutas
│   ├── environments/          # Variables de entorno
│   ├── index.html             # HTML principal
│   ├── main.ts                # Punto de entrada
│   └── styles.css             # Estilos globales
├── angular.json               # Configuración de Angular
├── package.json               # Dependencias
└── tsconfig.json              # Configuración de TypeScript
```

## Servicios Disponibles

### EquiposService

Gestión de equipos del hospital:

```typescript
- getEquipos(filters?)           // Obtener todos los equipos
- getEquipoById(id)              // Obtener equipo por ID
- createEquipo(equipo)           // Crear nuevo equipo
- updateEquipo(id, equipo)       // Actualizar equipo
- deleteEquipo(id)               // Eliminar equipo
- searchEquipos(searchTerm)      // Buscar equipos
```

### MantenimientosService

Gestión de mantenimientos:

```typescript
- getMantenimientos(filters?)            // Obtener todos los mantenimientos
- getMantenimientoById(id)               // Obtener mantenimiento por ID
- getMantenimientosByEquipo(equipoId)    // Mantenimientos por equipo
- getMantenimientosByTecnico(tecnicoId)  // Mantenimientos por técnico
- createMantenimiento(mantenimiento)     // Crear mantenimiento
- updateMantenimiento(id, mantenimiento) // Actualizar mantenimiento
- deleteMantenimiento(id)                // Eliminar mantenimiento
- getDashboard(fechaInicio?, fechaFin?)  // Dashboard de estadísticas
```

### IndicadoresService

Estadísticas e indicadores:

```typescript
- getDashboard(fechaInicio?, fechaFin?)        // Dashboard completo
- getEstadisticasPorTipo(fechaInicio?, fechaFin?)  // Stats por tipo
- getEstadisticasPorFalla(fechaInicio?, fechaFin?) // Stats por falla
- getTiempoFueraServicio(fechaInicio?, fechaFin?)  // Tiempo fuera servicio
- calcularDisponibilidad(total, activos)       // Calcular disponibilidad
- calcularTiempoPromedioRespuesta(tiempos)     // Tiempo promedio
- calcularTasaPrimerArreglo(total, exitosos)   // Tasa de éxito
```

## Rutas de la Aplicación

- `/` → Redirecciona a `/dashboard`
- `/dashboard` → Panel principal
- `/equipos` → Gestión de equipos
- `/mantenimientos` → Gestión de mantenimientos
- `/indicadores` → Indicadores y estadísticas

## Características de UI/UX

### Responsive Design
- Diseño adaptable para dispositivos móviles, tablets y desktop
- Menú hamburguesa en dispositivos móviles
- Tablas con scroll horizontal en pantallas pequeñas

### Temas y Estilos
- Variables CSS personalizables
- Paleta de colores profesional
- Componentes reutilizables (botones, tarjetas, badges, etc.)
- Animaciones suaves

### Funcionalidades
- Búsqueda en tiempo real
- Filtros por múltiples criterios
- Paginación (preparado para implementación)
- Estados visuales (activo, pendiente, completado, etc.)

## Integración con Backend

El frontend consume la API REST del backend. Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.

### Endpoints Esperados

El backend debe exponer los siguientes endpoints:

- `GET /api/sysequipo` - Listar equipos
- `GET /api/sysequipo/:id` - Obtener equipo por ID
- `POST /api/sysequipo` - Crear equipo
- `PUT /api/sysequipo/:id` - Actualizar equipo
- `DELETE /api/sysequipo/:id` - Eliminar equipo

- `GET /api/sysmantenimiento` - Listar mantenimientos
- `GET /api/sysmantenimiento/:id` - Obtener mantenimiento
- `GET /api/sysmantenimiento/equipo/:id` - Mantenimientos por equipo
- `GET /api/sysmantenimiento/tecnico/:id` - Mantenimientos por técnico
- `POST /api/sysmantenimiento` - Crear mantenimiento
- `PUT /api/sysmantenimiento/:id` - Actualizar mantenimiento
- `DELETE /api/sysmantenimiento/:id` - Eliminar mantenimiento
- `GET /api/sysmantenimiento/dashboard` - Dashboard
- `GET /api/sysmantenimiento/estadisticas/tipo` - Estadísticas por tipo
- `GET /api/sysmantenimiento/estadisticas/falla` - Estadísticas por falla
- `GET /api/sysmantenimiento/estadisticas/tiempo-fuera-servicio` - Tiempo fuera

## Próximos Pasos

### Funcionalidades Pendientes

1. **Autenticación y Autorización**
   - Implementar login/logout
   - Guards para rutas protegidas
   - Manejo de tokens JWT

2. **CRUD Completo**
   - Modales para crear/editar equipos
   - Modales para crear/editar mantenimientos
   - Confirmación de eliminación

3. **Funcionalidades Avanzadas**
   - Generación de PDFs desde el frontend
   - Carga de archivos (firmas, imágenes)
   - Exportación de datos (Excel, CSV)
   - Paginación real conectada a backend
   - Filtros avanzados

4. **Mejoras de UX**
   - Notificaciones toast
   - Loading spinners
   - Manejo de errores mejorado
   - Validación de formularios

5. **Gráficos y Visualización**
   - Integrar librería de gráficos (Chart.js, ApexCharts)
   - Gráficos interactivos en indicadores
   - Dashboard con widgets personalizables

## Problemas Comunes

### Error: "Cannot GET /api/..."
- Verifica que el backend esté ejecutándose en el puerto 3000
- Revisa la configuración en `environment.ts`

### Error: CORS
- Configura CORS en el backend para permitir solicitudes desde `http://localhost:4200`

### Error: Module not found
- Ejecuta `npm install` para instalar todas las dependencias

## Soporte

Para reportar problemas o solicitar nuevas características, contacta al equipo de desarrollo.

## Licencia

Este proyecto es propiedad del Hospital San Rafael.

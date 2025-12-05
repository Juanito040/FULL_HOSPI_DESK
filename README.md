# Sistema de Gestión de Mantenimiento - Hospital San Rafael

Sistema integral para la gestión y control de equipos médicos y tecnológicos, incluyendo mantenimientos preventivos y correctivos, hojas de vida, inventarios y reportes de backups.

## Descripción General

Aplicación web desarrollada para el Hospital San Rafael que permite gestionar de manera eficiente el ciclo completo de mantenimiento de equipos médicos y de sistemas, desde la adquisición hasta la baja definitiva del equipo.

## Arquitectura del Sistema

### Backend
- **Framework**: Node.js con Express
- **Base de datos**: MySQL con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Express Validator
- **Arquitectura**: MVC (Model-View-Controller)

### Frontend
- **Framework**: Angular 17
- **Componentes**: Standalone Components
- **Estilos**: CSS personalizado con variables globales
- **Enrutamiento**: Angular Router con guards de autenticación y roles
- **Estado**: RxJS Observables

## Requisitos Previos

### Backend
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 5.7

### Frontend
- Angular CLI 17.0.0
- Node.js >= 16.0.0

## Instalación

### Clonar el repositorio
```bash
git clone https://github.com/Juanito040/FULL_HOSPI_DESK.git
cd HRCATCHFINAL
```

### Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd Back
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` en la raíz del directorio `Back`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. Iniciar servidor de desarrollo:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd Front
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar entornos:
Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

4. Iniciar servidor de desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
HRCATCHFINAL/
├── Back/
│   ├── src/
│   │   ├── controllers/      # Controladores de la API
│   │   ├── models/           # Modelos Sequelize
│   │   │   └── sequelize/    # Definiciones de modelos
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   ├── middleware/       # Middleware personalizado
│   │   ├── utils/            # Utilidades y helpers
│   │   └── config/           # Configuraciones
│   ├── package.json
│   └── server.js             # Punto de entrada
│
└── Front/
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Componentes reutilizables
    │   │   ├── pages/        # Componentes de página
    │   │   ├── services/     # Servicios HTTP
    │   │   ├── guards/       # Guards de rutas
    │   │   ├── interceptors/ # Interceptores HTTP
    │   │   └── utils/        # Constantes y utilidades
    │   ├── environments/     # Configuración de entornos
    │   └── styles.css        # Estilos globales
    └── package.json
```

## Módulos del Sistema

### 1. Autenticación y Usuarios
- Inicio de sesión con JWT
- Gestión de usuarios
- Control de roles (Administrador, Supervisor, Técnico)
- Protección de rutas por rol

### 2. Equipos de Sistemas
- Registro completo de equipos tecnológicos
- Categorización por tipo (Servidor, Computador, Switch, etc.)
- Estados: Activo, Inactivo, En Bodega, Dado de Baja
- Asignación por hospital y servicio
- Histórico de cambios

### 3. Mantenimientos
- Registro de mantenimientos preventivos y correctivos
- Tipos: Correctivo, Preventivo, Predictivo, Otro
- Control de tiempos (hora de llamado, inicio, terminación)
- Clasificación de fallas
- Actividades realizadas
- Repuestos utilizados
- Técnico responsable

### 4. Hojas de Vida
- Documentación completa del equipo
- Datos técnicos y especificaciones
- Información del fabricante y proveedor
- Documentos adjuntos
- Garantías y licencias
- Histórico de eventos

### 5. Backups
- Registro de respaldos de sistemas
- Tipos de recurso (Servidores, Bases de datos, etc.)
- Medios de backup (Cinta, Disco, Servidor)
- Periodicidad (Diario, Semanal, Mensual)
- Control de backups pendientes
- Alertas automáticas

### 6. Indicadores
- Dashboard de estadísticas
- Métricas de mantenimiento
- Gráficos de tendencias
- Filtros por fecha y tipo

### 7. Inventario
- Visualización consolidada de equipos
- Filtros avanzados
- Exportación de datos
- Estados y ubicaciones

## API Endpoints

### Autenticación
```
POST   /api/auth/login          # Iniciar sesión
POST   /api/auth/register       # Registrar usuario
GET    /api/auth/me             # Obtener usuario actual
```

### Usuarios
```
GET    /api/usuario             # Listar usuarios
GET    /api/usuario/:id         # Obtener usuario
POST   /api/usuario             # Crear usuario
PUT    /api/usuario/:id         # Actualizar usuario
DELETE /api/usuario/:id         # Eliminar usuario
```

### Equipos
```
GET    /api/sysequipo           # Listar equipos
GET    /api/sysequipo/:id       # Obtener equipo
POST   /api/sysequipo           # Crear equipo
PUT    /api/sysequipo/:id       # Actualizar equipo
DELETE /api/sysequipo/:id       # Eliminar equipo
```

### Mantenimientos
```
GET    /api/sysmantenimiento                    # Listar mantenimientos
GET    /api/sysmantenimiento/:id                # Obtener mantenimiento
GET    /api/sysmantenimiento/equipo/:idEquipo   # Por equipo
GET    /api/sysmantenimiento/dashboard          # Estadísticas
POST   /api/sysmantenimiento                    # Crear mantenimiento
PUT    /api/sysmantenimiento/:id                # Actualizar mantenimiento
DELETE /api/sysmantenimiento/:id                # Eliminar mantenimiento
```

### Hojas de Vida
```
GET    /api/syshojavida         # Listar hojas de vida
GET    /api/syshojavida/:id     # Obtener hoja de vida
POST   /api/syshojavida         # Crear hoja de vida
PUT    /api/syshojavida/:id     # Actualizar hoja de vida
DELETE /api/syshojavida/:id     # Eliminar hoja de vida
```

### Backups
```
GET    /api/backups                        # Listar backups
GET    /api/backups/:id                    # Obtener backup
GET    /api/backup/pendientes              # Backups pendientes
GET    /api/backup/pendientes/:id          # Detalle de pendientes
GET    /api/backup/usuario/:usuarioId      # Por usuario
GET    /api/backup/rango                   # Por rango de fechas
POST   /api/backup                         # Crear backup
PUT    /api/backup/:id                     # Actualizar backup
DELETE /api/backup/:id                     # Eliminar backup
```

### Catálogos
```
GET    /api/catalogos/hospitales     # Listar hospitales
GET    /api/catalogos/servicios      # Listar servicios
GET    /api/catalogos/tipos-equipo   # Listar tipos de equipo
GET    /api/catalogos/all            # Todos los catálogos
```

## Modelos de Base de Datos

### Principales Tablas

#### usuario
- Gestión de usuarios del sistema
- Campos: id, nombres, apellidos, email, contraseña, rol

#### sysequipo
- Equipos de sistemas registrados
- Campos: id, nombre, marca, modelo, serie, tipo, estado, ubicación

#### sysmantenimiento
- Mantenimientos realizados
- Campos: id, fecha, tipo_mantenimiento, tipo_falla, equipo, técnico

#### syshojavida
- Hojas de vida de equipos
- Campos: id, equipo, fabricante, proveedor, garantía, documentos

#### reporte_backup
- Reportes de backups
- Campos: id, nombre_recurso, tipo_recurso, medio, periodicidad, fecha

## Seguridad

### Autenticación
- Tokens JWT con expiración configurable
- Contraseñas hasheadas con bcryptjs
- Validación de tokens en cada petición protegida

### Autorización
- Guards de autenticación en rutas del frontend
- Guards de roles para operaciones específicas
- Middleware de verificación en backend

### Validaciones
- Express Validator en backend
- Validaciones reactivas en formularios de Angular
- Sanitización de datos de entrada

## Sistema de Notificaciones

El sistema implementa un servicio centralizado de notificaciones con los siguientes tipos:

- **Success**: Operaciones completadas exitosamente
- **Error**: Errores en operaciones
- **Warning**: Advertencias y validaciones
- **Info**: Información general

Las notificaciones se muestran de forma no invasiva mediante toast notifications.

## Roles y Permisos

### Administrador
- Acceso completo a todos los módulos
- Gestión de usuarios
- Configuración del sistema
- Eliminar registros

### Supervisor
- Visualización de todos los módulos
- Creación y edición de registros
- Generación de reportes
- Sin permisos de eliminación

### Técnico
- Visualización limitada
- Creación de mantenimientos
- Actualización de estados
- Sin acceso a configuración

## Desarrollo

### Ejecutar en modo desarrollo

Backend:
```bash
cd Back
npm run dev
```

Frontend:
```bash
cd Front
npm start
```

### Compilar para producción

Backend:
```bash
cd Back
npm run build
```

Frontend:
```bash
cd Front
npm run build
```

Los archivos compilados se generarán en `Front/dist/`

## Tecnologías Utilizadas

### Backend
- Express.js 4.18.2
- Sequelize 6.35.1
- MySQL2 3.6.5
- JSON Web Token 9.0.2
- BCrypt.js 3.0.3
- Express Validator 7.0.1
- Nodemailer 6.9.7
- Day.js 1.11.19

### Frontend
- Angular 17.0.0
- RxJS 7.8.0
- Bootstrap Icons 1.13.1
- SweetAlert2 11.26.3
- TypeScript 5.2.2

## Guía de Contribución

1. Crear una nueva rama desde `main`
2. Realizar cambios y commits descriptivos
3. Asegurar que el código pase las validaciones
4. Crear Pull Request con descripción detallada
5. Esperar revisión del equipo

## Convenciones de Código

### Backend
- Nomenclatura de archivos: kebab-case
- Clases: PascalCase
- Funciones y variables: camelCase
- Constantes: UPPER_SNAKE_CASE

### Frontend
- Componentes: kebab-case
- Clases y servicios: PascalCase
- Variables y métodos: camelCase
- Interfaces: PascalCase con prefijo 'I' (opcional)

## Solución de Problemas

### Error de conexión a base de datos
Verificar credenciales en archivo `.env` y que el servidor MySQL esté activo.

### Error de CORS
Configurar correctamente los orígenes permitidos en `Back/src/middleware/cors.js`

### Módulos de Node no encontrados
Ejecutar `npm install` en el directorio correspondiente.

### Puerto en uso
Cambiar el puerto en variables de entorno o detener el proceso que ocupa el puerto.

## Licencia

Este proyecto es propiedad del Hospital San Rafael. Todos los derechos reservados.

## Contacto

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0
**Última actualización**: Diciembre 2025
**Desarrollado por**: Juan Miguel Ramirez Mancilla

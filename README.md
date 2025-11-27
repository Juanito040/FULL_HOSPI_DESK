# Hospital San Rafael - Sistema de Gestión de Equipos

Sistema web completo para la gestión de equipos médicos del Hospital San Rafael, desarrollado con Angular en el frontend y Node.js/Express en el backend.

## Tecnologías Utilizadas

### Frontend
- Angular 17
- TypeScript
- RxJS
- Angular Router
- Angular Forms

### Backend
- Node.js (>= 16.0.0)
- Express.js
- MySQL
- Sequelize ORM
- Express Validator
- CORS
- dotenv

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) (versión 8 o superior)
- [MySQL](https://www.mysql.com/) (versión 5.7 o superior)
- [Angular CLI](https://angular.io/cli) (opcional pero recomendado)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd HRCATCHFINAL
```

### 2. Instalar dependencias del Backend

```bash
cd Back
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../Front
npm install
```

## Configuración

### Configuración del Backend

1. En la carpeta `Back`, crea un archivo `.env` basándote en el siguiente ejemplo:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_san_rafael
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_DIALECT=mysql

# Configuración de CORS
CORS_ORIGIN=http://localhost:4200
```

2. Crea la base de datos en MySQL:

```sql
CREATE DATABASE hospital_san_rafael CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Las tablas se crearán automáticamente al ejecutar el servidor gracias a Sequelize.

### Configuración del Frontend (opcional)

Si necesitas cambiar la URL de la API, modifica los archivos de configuración en `Front/src/environments/`:

```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Ejecución

### Iniciar el Backend

Desde la carpeta `Back`:

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Iniciar el Frontend

Desde la carpeta `Front`:

```bash
# Modo desarrollo
npm start

# O usando Angular CLI
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Ejecutar ambos simultáneamente

Abre dos terminales:

**Terminal 1 (Backend):**
```bash
cd Back
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Front
npm start
```

## Estructura del Proyecto

```
HRCATCHFINAL/
├── Back/                          # Backend - API REST
│   ├── src/
│   │   ├── config/               # Configuración de la base de datos
│   │   ├── controllers/          # Controladores de la API
│   │   ├── models/               # Modelos de Sequelize
│   │   ├── routes/               # Rutas de la API
│   │   ├── services/             # Lógica de negocio
│   │   ├── middlewares/          # Middlewares personalizados
│   │   ├── utils/                # Utilidades
│   │   ├── migrations/           # Migraciones de base de datos
│   │   ├── seeders/              # Datos iniciales
│   │   ├── app.js                # Configuración de Express
│   │   └── index.js              # Punto de entrada
│   ├── .env                      # Variables de entorno (crear)
│   ├── .gitignore
│   └── package.json
│
├── Front/                         # Frontend - Angular
│   ├── src/
│   │   ├── app/                  # Componentes de la aplicación
│   │   ├── assets/               # Recursos estáticos
│   │   └── environments/         # Configuración de entornos
│   ├── angular.json
│   └── package.json
│
├── .gitignore                     # Ignorar archivos en git
└── README.md                      # Este archivo
```

## Scripts Disponibles

### Backend (`Back/`)

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

### Frontend (`Front/`)

- `npm start` - Inicia el servidor de desarrollo de Angular
- `npm run build` - Construye la aplicación para producción
- `npm run watch` - Construye en modo watch
- `npm test` - Ejecuta las pruebas

## API Endpoints

La API REST está disponible en `http://localhost:3000/api`

Los endpoints principales están organizados por recursos. Consulta la documentación de la API o revisa los archivos en `Back/src/routes/` para más detalles.

## Base de Datos

El sistema utiliza MySQL con Sequelize ORM. Las tablas se crean automáticamente al iniciar el servidor por primera vez.

Si necesitas ejecutar migraciones o seeders manualmente:

```bash
cd Back
# Ejecutar migraciones
npx sequelize-cli db:migrate

# Ejecutar seeders
npx sequelize-cli db:seed:all
```

## Solución de Problemas

### Error de conexión a la base de datos

- Verifica que MySQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos exista

### Error de CORS

- Verifica que `CORS_ORIGIN` en `.env` coincida con la URL del frontend
- Por defecto debe ser `http://localhost:4200`

### Dependencias no encontradas

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## Licencia

ISC - Hospital San Rafael

## Contacto

Hospital San Rafael - Sistema de Gestión de Equipos

---

Desarrollado con Node.js, Express, Angular y MySQL

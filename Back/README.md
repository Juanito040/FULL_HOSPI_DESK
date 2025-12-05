#  Hospital San Rafael - API REST

Sistema de Gestión de Equipos Médicos y de Sistemas para el Hospital San Rafael.

##  Características

-  CRUD completo de equipos de sistemas (IT)
-  Gestión de mantenimientos preventivos y correctivos
-  Hojas de vida de equipos
-  Dashboard con estadísticas en tiempo real
-  Gestión de repuestos
-  Control de bajas de equipos
-  Reportes y exportaciones

##  Inicio Rápido

### Requisitos Previos

- Node.js >= 16.0.0
- MySQL/MariaDB >= 8.0
- npm >= 8.0.0

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repo>
cd HRCATCHFINAL
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_hospi
DB_USER=root
DB_PASSWORD=tu_password
```

4. **Crear la base de datos**
```bash
mysql -u root -p
CREATE DATABASE db_hospi;
exit
```

5. **Ejecutar scripts SQL**
```bash
mysql -u root -p db_hospi < database/schema_full_new.sql
mysql -u root -p db_hospi < database/datos_prueba_sysmantenimiento.sql
```

6. **Iniciar el servidor**
```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

##  API Endpoints

### Base
```
GET /api
```

### Equipos de Sistemas
```
GET    /api/sysequipos
GET    /api/sysequipos/:id
POST   /api/sysequipos
PUT    /api/sysequipos/:id
DELETE /api/sysequipos/:id
```

### Mantenimientos de Sistemas
```
GET    /api/sysmantenimiento/dashboard
GET    /api/sysmantenimiento
GET    /api/sysmantenimiento/:id
POST   /api/sysmantenimiento
PUT    /api/sysmantenimiento/:id
DELETE /api/sysmantenimiento/:id
GET    /api/sysmantenimiento/equipo/:idEquipo
GET    /api/sysmantenimiento/tecnico/:idUsuario
GET    /api/sysmantenimiento/estadisticas/tipo
GET    /api/sysmantenimiento/estadisticas/falla
```

### Hojas de Vida
```
GET    /api/syshojasdevida
GET    /api/syshojasdevida/:id
POST   /api/syshojasdevida
PUT    /api/syshojasdevida/:id
DELETE /api/syshojasdevida/:id
```

##  Testing con Postman

1. Importa la colección de Postman:
   - `postman/SysMantenimiento_Collection.postman_collection.json`

2. Importa el environment:
   - `postman/Hospital_SanRafael_Environment.postman_environment.json`

3. Selecciona el environment "Hospital San Rafael - Environment"

4. ¡Listo para probar todos los endpoints!

Ver documentación completa: `postman/README_POSTMAN.md`

##  Estructura del Proyecto

```
HRCATCHFINAL/
├── src/
│   ├── config/           # Configuraciones
│   ├── controllers/      # Controladores
│   ├── middlewares/      # Middlewares y validadores
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── app.js           # Configuración de Express
│   └── index.js         # Punto de entrada
├── database/            # Scripts SQL
├── postman/             # Colecciones de Postman
├── .env                 # Variables de entorno (no versionar)
├── .env.example         # Ejemplo de variables
├── .gitignore           # Archivos ignorados por Git
├── package.json         # Dependencias del proyecto
└── README.md           # Este archivo
```

##  Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **Express Validator** - Validación de datos
- **Dotenv** - Gestión de variables de entorno
- **CORS** - Control de acceso entre dominios

##  Base de Datos

### Tablas Principales

- `usuario` - Usuarios del sistema
- `sysequipo` - Equipos de sistemas (IT)
- `syshojavida` - Hojas de vida de equipos IT
- `sysmantenimiento` - Mantenimientos de sistemas
- `sysrepuestos` - Repuestos de equipos IT
- `sysbaja` - Equipos dados de baja
- `servicio` - Servicios del hospital
- `tipoequipo` - Tipos de equipos

Ver esquema completo: `database/schema_full_new.sql`

##  Seguridad

- Variables de entorno para credenciales sensibles
- JWT para autenticación (si se implementa)
- Validación de datos en todas las peticiones
- CORS configurado
- Sanitización de inputs


##  Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Tests (pendiente de configurar)
npm test
```

##  Solución de Problemas

### Error: Cannot connect to database
```bash
# Verifica que MySQL esté corriendo
mysql --version

# Verifica las credenciales en .env
cat .env
```

### Error: Module not found
```bash
# Reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Cambia el puerto en .env
PORT=3001
```



##  Licencia

JUAN MIGUEL RAMIREZ MANCILLA

##  Contacto

Hospital San Rafael - Proyecto Académico

---

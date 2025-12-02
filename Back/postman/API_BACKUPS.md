# API de Backups - Hospital San Rafael

## 📋 Resumen de Endpoints

Base URL: `http://localhost:3000/api`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/backup` | Obtener todos los backups |
| GET | `/backup/:id` | Obtener un backup por ID |
| GET | `/backup/usuario/:usuarioId` | Obtener backups de un usuario específico |
| GET | `/backup/rango` | Obtener backups por rango de fechas |
| GET | `/backup/pendientes` | Obtener lista de backups pendientes |
| GET | `/backup/pendientes/:id` | Obtener detalles de backups pendientes |
| POST | `/backup` | Crear un nuevo backup |
| PUT | `/backup/:id` | Actualizar un backup |
| DELETE | `/backup/:id` | Eliminar un backup |

---

## 🔍 Detalle de Endpoints

### 1. Obtener todos los backups
```http
GET /api/backup
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_reporte_backup": 1,
      "nombre_recurso": "Servidor SQL",
      "tipo_recurso": "Base de datos",
      "destino": "Storage Local",
      "medio": "Disco",
      "periodicidad": "Diario",
      "fecha_backup": "2024-11-30T08:30:00.000Z",
      "tamano": "250 GB",
      "autor_solicita": "Admin",
      "numero_caso_ms": "MS-001",
      "caso_ms": "Si",
      "observaciones": "Respaldo exitoso",
      "id_autor_realizado_fk": 1,
      "createdAt": "2024-11-30T10:15:00.000Z",
      "updatedAt": "2024-11-30T10:15:00.000Z",
      "autorRealizado": {
        "id": 1,
        "nombres": "Juan",
        "apellidos": "Admin",
        "email": "admin@hospital.com"
      }
    }
  ],
  "count": 1
}
```

---

### 2. Obtener un backup por ID
```http
GET /api/backup/:id
```

**Parámetros:**
- `id` (number) - ID del backup

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Backup no encontrado"
}
```

---

### 3. Obtener backups por usuario
```http
GET /api/backup/usuario/:usuarioId
```

**Parámetros:**
- `usuarioId` (number) - ID del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 5
}
```

---

### 4. Obtener backups por rango de fechas
```http
GET /api/backup/rango?inicio=2024-11-01&fin=2024-11-30&limit=100&offset=0
```

**Parámetros (Query):**
- `inicio` (string, required) - Fecha de inicio en formato YYYY-MM-DD
- `fin` (string, required) - Fecha final en formato YYYY-MM-DD
- `limit` (number, optional) - Número máximo de resultados (default: 100)
- `offset` (number, optional) - Número de registros a saltar (default: 0)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 15
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Formato de fecha inválido. Use YYYY-MM-DD"
}
```

---

### 5. Obtener backups pendientes
```http
GET /api/backup/pendientes
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_reporte_backup": 1,
      "nombre_recurso": "Servidor SQL",
      "periodicidad": "Diario",
      "destino": "Storage Local",
      "faltantes": ["2024-11-28", "2024-11-29", "2024-11-30"],
      "ultimo_backup": "2024-11-27"
    }
  ],
  "count": 1
}
```

**Sin pendientes (200):**
```json
{
  "success": true,
  "message": "No hay backups pendientes",
  "data": []
}
```

---

### 6. Obtener detalles de backups pendientes por ID
```http
GET /api/backup/pendientes/:id
```

**Parámetros:**
- `id` (number) - ID del backup

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "recurso": "Servidor SQL",
    "periodicidad": "Diario",
    "ultimo_backup": "2024-11-27",
    "faltantes": ["2024-11-28", "2024-11-29", "2024-11-30"]
  }
}
```

---

### 7. Crear un nuevo backup
```http
POST /api/backup
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre_recurso": "Servidor Exchange",
  "tipo_recurso": "Correo",
  "destino": "Google Cloud",
  "medio": "Servidor",
  "periodicidad": "Semanal",
  "fecha_backup": "2024-11-30T14:00:00Z",
  "tamano": "500 GB",
  "autor_solicita": "IT Manager",
  "numero_caso_ms": "MS-002",
  "caso_ms": "No",
  "observaciones": "Respaldo a nube",
  "id_autor_realizado_fk": 2
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Backup creado exitosamente",
  "data": { ... }
}
```

---

### 8. Actualizar un backup
```http
PUT /api/backup/:id
Content-Type: application/json
```

**Parámetros:**
- `id` (number) - ID del backup

**Body (JSON):** (Solo incluir campos a actualizar)
```json
{
  "fecha_backup": "2024-11-30T16:00:00Z",
  "tamano": "520 GB",
  "observaciones": "Respaldo completado exitosamente"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Backup actualizado exitosamente",
  "data": { ... }
}
```

---

### 9. Eliminar un backup
```http
DELETE /api/backup/:id
```

**Parámetros:**
- `id` (number) - ID del backup

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Backup eliminado exitosamente"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Backup no encontrado"
}
```

---

## 📊 Modelos de Datos

### Backup
```javascript
{
  id_reporte_backup: Integer (PrimaryKey),
  nombre_recurso: String,
  tipo_recurso: ENUM('Servidor virtual', 'Servidor fisico', 'Base de datos', 'Computador', 'Correo', 'Switch', 'TRD', 'Otro'),
  destino: String,
  medio: ENUM('Cinta', 'Disco', 'Servidor'),
  periodicidad: ENUM('Diario', 'Semanal', 'Mensual'),
  fecha_backup: Date,
  tamano: String,
  autor_solicita: String,
  numero_caso_ms: String,
  caso_ms: ENUM('Si', 'No'),
  observaciones: Text,
  id_autor_realizado_fk: Integer (FK -> Usuario),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Ejemplos de Uso (Postman)

### Crear Backup
```
POST http://localhost:3000/api/backup
```

**Body:**
```json
{
  "nombre_recurso": "Servidor Web Apache",
  "tipo_recurso": "Servidor fisico",
  "destino": "Almacenamiento NAS",
  "medio": "Disco",
  "periodicidad": "Diario",
  "fecha_backup": "2024-11-30T09:00:00Z",
  "tamano": "150 GB",
  "autor_solicita": "Soporte Técnico",
  "numero_caso_ms": "MS-2024-001",
  "caso_ms": "Si",
  "observaciones": "Backup rutinario diario",
  "id_autor_realizado_fk": 1
}
```

### Listar Backups Pendientes
```
GET http://localhost:3000/api/backup/pendientes
```

### Obtener Backups por Rango
```
GET http://localhost:3000/api/backup/rango?inicio=2024-11-01&fin=2024-11-30
```

---

## ⚠️ Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | Solicitud exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud inválida (parámetros incorrectos) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## 🔒 Autenticación

**Nota:** Los endpoints pueden requerir un token JWT en el header `Authorization` dependiendo de la configuración de middleware.

```
Authorization: Bearer <token>
```

---

## 📝 Notas

- Los backups pendientes se calculan basándose en la periodicidad (Diario, Semanal, Mensual)
- El sistema detecta automáticamente qué fechas de backup faltan desde la última entrada
- Los resultados siempre se devuelven ordenados por `fecha_backup` descendente
- Los IDs de usuarios deben existir en la tabla `usuario`

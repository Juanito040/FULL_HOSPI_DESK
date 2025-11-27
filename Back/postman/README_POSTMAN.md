# 📮 Colección Postman - SysMantenimiento API

## 📥 Cómo Importar en Postman

### Método 1: Importar desde archivo

1. Abre **Postman**
2. Haz clic en **Import** (esquina superior izquierda)
3. Selecciona **Upload Files**
4. Importa estos dos archivos:
   - `SysMantenimiento_Collection.postman_collection.json` (Colección)
   - `Hospital_SanRafael_Environment.postman_environment.json` (Environment)
5. Selecciona el environment "Hospital San Rafael - Environment" en la esquina superior derecha

### Método 2: Importar desde carpeta

1. Abre **Postman**
2. Haz clic en **Import**
3. Arrastra la carpeta `postman/` completa
4. Postman importará automáticamente ambos archivos

---

## 🗂️ Estructura de la Colección

### 1. **Dashboard y Estadísticas** (4 requests)
   - ✅ Dashboard Completo
   - ✅ Dashboard Mes Actual
   - ✅ Estadísticas por Tipo
   - ✅ Estadísticas por Falla

### 2. **CRUD Mantenimientos** (7 requests)
   - ✅ Listar Todos
   - ✅ Listar con Filtros
   - ✅ Obtener por ID
   - ✅ Crear Completo
   - ✅ Crear Mínimo
   - ✅ Actualizar
   - ✅ Eliminar

### 3. **Consultas Específicas** (3 requests)
   - ✅ Por Equipo
   - ✅ Por Técnico
   - ✅ Por Técnico con Fechas

### 4. **Ejemplos de Diferentes Tipos** (3 requests)
   - ✅ Mantenimiento Correctivo
   - ✅ Mantenimiento Predictivo
   - ✅ Mantenimiento Solo Software

### 5. **Health Check** (2 requests)
   - ✅ API Root
   - ✅ Health Check

**Total: 19 requests listos para usar**

---

## 🔧 Configuración del Environment

La colección usa las siguientes variables:

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `base_url` | `http://localhost:3000` | URL base del servidor |
| `base_url_prod` | `https://api.hospitalsanrafael.com` | URL de producción |
| `fecha_hoy` | `2025-11-21` | Fecha actual |
| `id_equipo_test` | `1` | ID de equipo para pruebas |
| `id_usuario_test` | `5` | ID de usuario para pruebas |
| `id_mantenimiento_test` | `1` | ID de mantenimiento para pruebas |

### Cambiar entre Desarrollo y Producción:

1. En Postman, ve a **Environments**
2. Edita "Hospital San Rafael - Environment"
3. Habilita `base_url` para desarrollo
4. O habilita `base_url_prod` para producción

---

## 🚀 Orden Recomendado para Probar

### Primera Vez:

1. **Health Check** → Verificar que el servidor esté corriendo
   ```
   GET /api/health
   ```

2. **API Root** → Ver endpoints disponibles
   ```
   GET /api
   ```

3. **Crear Mantenimiento Mínimo** → Insertar datos de prueba
   ```
   POST /api/sysmantenimiento
   ```

4. **Listar Todos** → Verificar que se creó
   ```
   GET /api/sysmantenimiento
   ```

5. **Dashboard Mes Actual** → Ver estadísticas
   ```
   GET /api/sysmantenimiento/dashboard
   ```

### Flujo Completo:

```
1. Health Check
   ↓
2. Crear Mantenimiento Correctivo
   ↓
3. Crear Mantenimiento Preventivo
   ↓
4. Crear Mantenimiento Predictivo
   ↓
5. Listar Todos (verificar 3 creados)
   ↓
6. Dashboard Completo (ver estadísticas)
   ↓
7. Estadísticas por Tipo
   ↓
8. Mantenimientos por Equipo
   ↓
9. Actualizar Mantenimiento
   ↓
10. Obtener por ID (verificar actualización)
```

---

## 📝 Ejemplos de Body para POST

### Mantenimiento Completo (Todos los campos):
```json
{
  "id_sysequipo_fk": 1,
  "numero_reporte": "MTTO-SYS-2025-001",
  "fecha": "2025-11-21",
  "hora_llamado": "08:00:00",
  "hora_inicio": "08:30:00",
  "hora_terminacion": "10:30:00",
  "tipo_mantenimiento": "Preventivo",
  "tipo_falla": "Sin Falla",
  "mphardware": "Limpieza de componentes",
  "mpsoftware": "Actualización de sistema",
  "rutinah": "Limpieza profunda",
  "rutinas": "Escaneo de virus",
  "observacionesh": "Equipo en buen estado",
  "observacioness": "Sistema actualizado",
  "autor_realizado": "Juan Pérez",
  "autor_recibido": "María García",
  "tiempo_fuera_servicio": 120,
  "dano": "Ninguno",
  "entega": "Equipo entregado correctamente",
  "rutahardware": "/reportes/hardware-001.pdf",
  "rutasoftware": "/reportes/software-001.pdf",
  "rutaentrega": "/reportes/entrega-001.pdf",
  "id_sysusuario_fk": 5
}
```

### Mantenimiento Mínimo (Solo campos requeridos):
```json
{
  "id_sysequipo_fk": 1,
  "fecha": "2025-11-21",
  "tipo_mantenimiento": "Preventivo"
}
```

---

## 🎯 Valores Válidos para ENUM

### `tipo_mantenimiento`:
- `"Correctivo"`
- `"Preventivo"`
- `"Predictivo"`
- `"Otro"`

### `tipo_falla`:
- `"Desgaste"`
- `"Operación Indebida"`
- `"Causa Externa"`
- `"Accesorios"`
- `"Desconocido"`
- `"Sin Falla"`
- `"Otros"`
- `"No Registra"`

---

## 🔍 Query Parameters Disponibles

### Dashboard y Estadísticas:
```
?fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

### Listar con Filtros:
```
?id_equipo=1&tipo_mantenimiento=Preventivo&fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

### Por Técnico con Fechas:
```
?fecha_inicio=2025-11-01&fecha_fin=2025-11-30
```

---

## ✅ Respuestas Esperadas

### Éxito (200/201):
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "count": 10
}
```

### Error de Validación (400):
```json
{
  "success": false,
  "errors": [
    {
      "msg": "El ID del equipo es requerido",
      "param": "id_sysequipo_fk",
      "location": "body"
    }
  ]
}
```

### No Encontrado (404):
```json
{
  "success": false,
  "message": "Mantenimiento no encontrado"
}
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot GET /api/sysmantenimiento"
**Solución:** Verifica que el servidor esté corriendo:
```bash
npm start
```

### ❌ Error: "Connection refused"
**Solución:** Cambia el `base_url` al puerto correcto en el environment

### ❌ Error: "id_sysequipo_fk: foreign key constraint fails"
**Solución:** Asegúrate de que el equipo con ese ID existe en la tabla `sysequipo`

### ❌ Error: "Validation failed"
**Solución:** Revisa los valores ENUM permitidos en este documento

---

## 📊 Dashboard Response Example

```json
{
  "success": true,
  "data": {
    "estadisticasTipo": {
      "correctivos": 15,
      "preventivos": 30,
      "predictivos": 5,
      "otros": 2,
      "total": 52
    },
    "estadisticasFalla": {
      "desgaste": 10,
      "operacionIndebida": 5,
      "causaExterna": 3,
      "accesorios": 2,
      "desconocido": 1,
      "sinFalla": 30,
      "otros": 1,
      "noRegistra": 0
    },
    "tiempoFueraServicio": 2400,
    "equiposConMasMantenimientos": [
      {
        "id_sysequipo_fk": 5,
        "total": "8",
        "equipo": {
          "id_sysequipo": 5,
          "nombre_equipo": "PC Escritorio",
          "marca": "Dell",
          "modelo": "OptiPlex 7090"
        }
      }
    ],
    "mantenimientosRecientes": [ ... ],
    "fechaInicio": "2025-11-01",
    "fechaFin": "2025-11-30"
  }
}
```

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que las tablas estén creadas en la BD
2. Revisa los logs del servidor
3. Comprueba que el environment esté seleccionado en Postman
4. Verifica que los IDs de equipos/usuarios existan en la BD

---

**¡Feliz Testing! 🚀**

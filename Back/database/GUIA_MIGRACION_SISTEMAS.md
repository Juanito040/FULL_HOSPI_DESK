# Guía de Migración - Módulo de Sistemas

## 📋 Resumen

Esta guía te ayudará a migrar tu base de datos del módulo de sistemas para que coincida exactamente con el SQL proporcionado.

---

## ⚠️ ADVERTENCIAS IMPORTANTES

1. **HACER BACKUP** antes de ejecutar cualquier script
2. La migración modifica **TIPOS DE DATOS** y puede causar **PÉRDIDA DE DATOS** si no se hace correctamente
3. El cambio más crítico es en `sysmantenimiento`: ENUM → INT
4. Tiempo estimado: **10-15 minutos**
5. **NO ejecutar en producción sin probar antes en desarrollo**

---

## 🎯 Cambios Principales

### 1. Tabla `sysequipo`
- ✅ Agregados 3 campos nuevos
- ⚠️ Cambios de tipo de datos (7 campos)

### 2. Tabla `syshoja_vida`
- ✅ Agregados 11 campos nuevos
- ⚠️ Cambios de tipo de datos (4 campos)

### 3. Tabla `sysmantenimiento` (CRÍTICA)
- 🔴 **ENUM → INT** en `tipo_mantenimiento` y `tipo_falla`
- 🔴 **TEXT → BIT** en 4 campos (mphardware, mpsoftware, dano, entega)
- ⚠️ Cambios de tipo de datos (4 campos adicionales)

### 4. Tabla `sysrepuestos`
- ⚠️ Cambios menores de tipo de datos

### 5. Tabla `sysbaja`
- ✅ Sin cambios (ya coincide)

---

## 📦 Paso 1: Crear Backup

```bash
# Desde la terminal (Windows)
cd Back/database

# Crear backup
mysqldump -u root -p db_hospi > backup_$(date +%Y%m%d_%H%M%S).sql

# O con la fecha manual
mysqldump -u root -p db_hospi > backup_20251203.sql
```

**Verificar que el archivo backup fue creado correctamente antes de continuar.**

---

## 🗄️ Paso 2: Ejecutar Migración SQL

```bash
# Conectar a MySQL
mysql -u root -p

# Seleccionar la base de datos
USE db_hospi;

# Ejecutar el script de migración
SOURCE migration_sync_sistemas.sql;
```

**O ejecutar desde MySQL Workbench:**
1. Abrir `migration_sync_sistemas.sql`
2. Ejecutar todo el script
3. Verificar que no haya errores

---

## 🔍 Paso 3: Verificar la Migración

Ejecutar las siguientes consultas para verificar:

```sql
-- Verificar campos nuevos en sysequipo
SHOW COLUMNS FROM sysequipo LIKE 'preventivo_s';
SHOW COLUMNS FROM sysequipo LIKE 'fecha_modificacion';
SHOW COLUMNS FROM sysequipo LIKE 'ubicacion_anterior';

-- Verificar campos nuevos en syshoja_vida
SHOW COLUMNS FROM syshoja_vida LIKE 'asignadoporgobernacion';
SHOW COLUMNS FROM syshoja_vida LIKE 'departamento';

-- Verificar cambio a INT en sysmantenimiento
DESCRIBE sysmantenimiento;
-- tipo_mantenimiento y tipo_falla deben ser INT

-- Verificar tabla de backup
SELECT COUNT(*) FROM sysmantenimiento_backup_20251203;
```

---

## 🔧 Paso 4: Actualizar Backend (Ya está hecho)

Los siguientes archivos **YA FUERON ACTUALIZADOS**:

### ✅ Archivos Modificados:

1. **`src/utils/sysConstants.js`** - NUEVO
   - Constantes para mapeo INT ↔ String
   - Funciones de validación
   - Funciones de conversión

2. **`src/models/sequelize/sysequipo.model.js`**
   - Campos nuevos agregados
   - Tipos de datos corregidos

3. **`src/models/sequelize/syshoja_vida.model.js`**
   - 11 campos nuevos agregados
   - Tipos de datos corregidos

4. **`src/models/sequelize/sysmantenimiento.model.js`**
   - ENUM → INT en tipo_mantenimiento y tipo_falla
   - TEXT → BOOLEAN en 4 campos
   - Tipos de datos corregidos

5. **`src/models/sequelize/sysrepuestos.model.js`**
   - Tipos de datos corregidos

6. **`src/controllers/sysmantenimiento.controller.js`**
   - Agregados 2 endpoints nuevos para catálogos

7. **`src/routes/sysmantenimiento.routes.js`**
   - Rutas para catálogos agregadas

8. **`src/middlewares/validators/sysmantenimiento.validator.js`**
   - Validación actualizada para INT en lugar de ENUM

---

## 🌐 Paso 5: Actualizar Frontend

### Nuevos Endpoints Disponibles:

```typescript
// Obtener catálogo de tipos de mantenimiento
GET /api/sysmantenimiento/catalogos/tipos-mantenimiento
// Respuesta: [{ value: 1, label: "Correctivo" }, ...]

// Obtener catálogo de tipos de falla
GET /api/sysmantenimiento/catalogos/tipos-falla
// Respuesta: [{ value: 1, label: "Desgaste" }, ...]
```

### Cambios Necesarios en Angular:

#### 1. Actualizar Interfaces/Models

```typescript
// Antes (INCORRECTO):
export interface SysMantenimiento {
  tipo_mantenimiento?: 'Correctivo' | 'Preventivo' | 'Predictivo' | 'Otro';
  tipo_falla?: 'Desgaste' | 'Operación Indebida' | ...;
  mphardware?: string;
  mpsoftware?: string;
  dano?: string;
  entega?: string;
}

// Después (CORRECTO):
export interface SysMantenimiento {
  tipo_mantenimiento?: number; // 1=Correctivo, 2=Preventivo, 3=Predictivo, 4=Otro
  tipo_falla?: number; // 1-8
  mphardware?: boolean;
  mpsoftware?: boolean;
  dano?: boolean;
  entega?: boolean;
}

// Interfaz para catálogo
export interface CatalogoItem {
  value: number;
  label: string;
}
```

#### 2. Crear Servicio para Catálogos

```typescript
// src/app/services/sys-catalogos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CatalogoItem {
  value: number;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class SysCatalogosService {
  private baseUrl = 'http://localhost:3000/api/sysmantenimiento/catalogos';

  constructor(private http: HttpClient) {}

  getTiposMantenimiento(): Observable<{ success: boolean; data: CatalogoItem[] }> {
    return this.http.get<{ success: boolean; data: CatalogoItem[] }>(
      `${this.baseUrl}/tipos-mantenimiento`
    );
  }

  getTiposFalla(): Observable<{ success: boolean; data: CatalogoItem[] }> {
    return this.http.get<{ success: boolean; data: CatalogoItem[] }>(
      `${this.baseUrl}/tipos-falla`
    );
  }
}
```

#### 3. Actualizar Componentes

```typescript
// En el componente de mantenimiento
export class SysMantenimientoFormComponent implements OnInit {
  tiposMantenimiento: CatalogoItem[] = [];
  tiposFalla: CatalogoItem[] = [];

  constructor(
    private catalogosService: SysCatalogosService
  ) {}

  ngOnInit() {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.catalogosService.getTiposMantenimiento().subscribe(
      response => {
        this.tiposMantenimiento = response.data;
      }
    );

    this.catalogosService.getTiposFalla().subscribe(
      response => {
        this.tiposFalla = response.data;
      }
    );
  }
}
```

#### 4. Actualizar Templates

```html
<!-- ANTES (INCORRECTO) -->
<select formControlName="tipo_mantenimiento">
  <option value="Correctivo">Correctivo</option>
  <option value="Preventivo">Preventivo</option>
  <option value="Predictivo">Predictivo</option>
  <option value="Otro">Otro</option>
</select>

<!-- DESPUÉS (CORRECTO) -->
<select formControlName="tipo_mantenimiento">
  <option [value]="null">Seleccione...</option>
  <option *ngFor="let tipo of tiposMantenimiento" [value]="tipo.value">
    {{ tipo.label }}
  </option>
</select>

<!-- Para campos booleanos -->
<!-- ANTES -->
<textarea formControlName="mphardware"></textarea>

<!-- DESPUÉS -->
<input type="checkbox" formControlName="mphardware">
<label>Mantenimiento preventivo hardware realizado</label>
```

#### 5. Actualizar FormGroups

```typescript
// En el componente
this.mantenimientoForm = this.fb.group({
  tipo_mantenimiento: [null, Validators.required], // number
  tipo_falla: [null],                              // number
  mphardware: [false],                             // boolean
  mpsoftware: [false],                             // boolean
  dano: [false],                                   // boolean
  entega: [false],                                 // boolean
  // ... otros campos
});
```

#### 6. Funciones Helper (Opcional)

```typescript
// src/app/utils/sys-helpers.ts
export const TIPO_MANTENIMIENTO_LABELS = {
  1: 'Correctivo',
  2: 'Preventivo',
  3: 'Predictivo',
  4: 'Otro'
};

export const TIPO_FALLA_LABELS = {
  1: 'Desgaste',
  2: 'Operación Indebida',
  3: 'Causa Externa',
  4: 'Accesorios',
  5: 'Desconocido',
  6: 'Sin Falla',
  7: 'Otros',
  8: 'No Registra'
};

export function getTipoMantenimientoLabel(value: number): string {
  return TIPO_MANTENIMIENTO_LABELS[value] || 'Desconocido';
}

export function getTipoFallaLabel(value: number): string {
  return TIPO_FALLA_LABELS[value] || 'Desconocido';
}

// Uso en template
{{ getTipoMantenimientoLabel(mantenimiento.tipo_mantenimiento) }}
```

---

## 🔄 Paso 6: Probar la Aplicación

### 1. Reiniciar el Backend

```bash
cd Back
npm start
```

### 2. Probar Endpoints con Postman

```bash
# Obtener catálogos
GET http://localhost:3000/api/sysmantenimiento/catalogos/tipos-mantenimiento
GET http://localhost:3000/api/sysmantenimiento/catalogos/tipos-falla

# Crear mantenimiento (ahora con INT)
POST http://localhost:3000/api/sysmantenimiento
{
  "id_sysequipo_fk": 1,
  "tipo_mantenimiento": 1,  // INT en lugar de "Correctivo"
  "tipo_falla": 2,          // INT en lugar de "Operación Indebida"
  "mphardware": true,       // BOOLEAN en lugar de texto
  "mpsoftware": false,
  "dano": false,
  "entega": true
}
```

### 3. Probar Frontend

1. Iniciar aplicación Angular
2. Verificar que los select muestran las opciones correctas
3. Crear un nuevo mantenimiento
4. Verificar que se guarda correctamente
5. Verificar que se muestra correctamente en el listado

---

## 🔙 Rollback (Si algo sale mal)

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar rollback
SOURCE rollback_sync_sistemas.sql;
```

O restaurar desde backup:

```bash
mysql -u root -p db_hospi < backup_20251203.sql
```

---

## 📊 Mapeo de Valores

### Tipo de Mantenimiento:
| Valor INT | Label       |
|-----------|-------------|
| 1         | Correctivo  |
| 2         | Preventivo  |
| 3         | Predictivo  |
| 4         | Otro        |

### Tipo de Falla:
| Valor INT | Label               |
|-----------|---------------------|
| 1         | Desgaste            |
| 2         | Operación Indebida  |
| 3         | Causa Externa       |
| 4         | Accesorios          |
| 5         | Desconocido         |
| 6         | Sin Falla           |
| 7         | Otros               |
| 8         | No Registra         |

---

## ✅ Checklist Final

- [ ] Backup creado y verificado
- [ ] Script de migración ejecutado sin errores
- [ ] Verificación SQL completada
- [ ] Backend reiniciado correctamente
- [ ] Endpoints de catálogos funcionando
- [ ] Interfaces TypeScript actualizadas
- [ ] Servicios Angular actualizados
- [ ] Componentes actualizados
- [ ] Templates actualizados
- [ ] FormGroups actualizados
- [ ] Pruebas de creación exitosas
- [ ] Pruebas de edición exitosas
- [ ] Pruebas de listado exitosas

---

## 📞 Soporte

Si encuentras algún error durante la migración:

1. **NO PÁNICO** - El backup está ahí
2. Ejecuta el rollback inmediatamente
3. Revisa los mensajes de error
4. Verifica que todos los prerequisitos estén instalados
5. Contacta soporte si es necesario

---

## 🎉 ¡Migración Completada!

Una vez completados todos los pasos, tu módulo de sistemas estará completamente sincronizado con el SQL proporcionado.

**Recuerda:**
- Los datos antiguos están en `sysmantenimiento_backup_20251203`
- Los campos de texto convertidos a BIT están en columnas `*_texto` por seguridad
- Puedes eliminar el backup después de 1 semana de pruebas exitosas

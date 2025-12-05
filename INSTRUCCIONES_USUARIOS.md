# Configuración de Usuarios - Hospital San Rafael

## Credenciales Creadas por Defecto

El script `setup-users.js` crea los siguientes usuarios automáticamente:

###  Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Email:** admin@hospitalsr.com
- **Rol:** Administrador
- **Permisos:** Acceso completo al sistema

###  Ingeniero Biomédico
- **Usuario:** `jramirez`
- **Contraseña:** `biomedico123`
- **Email:** jramirez@hospitalsr.com
- **Rol:** Ingeniero Biomédico

###  Técnico de Sistemas
- **Usuario:** `mlopez`
- **Contraseña:** `sistemas123`
- **Email:** mlopez@hospitalsr.com
- **Rol:** Técnico de Sistemas

---

##  Cómo Ejecutar el Script

### Paso 1: Verificar Conexión a Base de Datos

Asegúrate de que tu archivo `.env` en la carpeta `Back` tenga la configuración correcta:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_hospi
DB_USER=root
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_secreto_jwt
```

### Paso 2: Ejecutar el Script

Abre una terminal en la carpeta `Back` y ejecuta:

```bash
cd Back
node setup-users.js
```

### Paso 3: Verificar la Creación

Si todo sale bien, verás un mensaje similar a:

```
 CONFIGURACIÓN COMPLETADA
 CREDENCIALES DE ACCESO:

 Administrador Sistema
   Usuario: admin
   Contraseña: admin123
   Rol: Administrador

...
```

---

##  Personalizar Usuarios

Si deseas crear usuarios diferentes, edita el archivo `Back/setup-users.js` y modifica el array `usuarios`:

```javascript
const usuarios = [
  {
    nombres: 'Tu Nombre',
    apellidos: 'Tu Apellido',
    nombreUsuario: 'tuusuario',
    tipoId: 'CC',
    numeroId: '1234567890',
    telefono: '3001234567',
    email: 'tu@email.com',
    contraseña: 'tucontraseña',
    registroInvima: 'REG-XXX',
    estado: 1,
    rolNombre: 'Administrador' // o cualquier otro rol
  }
];
```

---

##  Roles Disponibles

Los siguientes roles se crean automáticamente:

1. **Administrador** - Acceso total al sistema
2. **Ingeniero Biomédico** - Gestión de equipos biomédicos
3. **Técnico de Sistemas** - Gestión de equipos de sistemas
4. **Médico** - Acceso de consulta
5. **Enfermera** - Acceso de consulta

---

##  Seguridad Importante

1. **Cambiar contraseñas:** Inmediatamente después de crear los usuarios, cambia las contraseñas por defecto
2. **No compartir credenciales:** Cada usuario debe tener su propia cuenta
3. **JWT Secret:** Asegúrate de cambiar el `JWT_SECRET` en producción
4. **Backup:** Realiza backups regulares de la base de datos

---

##  Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que MySQL/MariaDB esté ejecutándose
- Revisa las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `db_hospi` exista

### Error: "Usuario ya existe"
- El usuario ya fue creado previamente
- Puedes eliminar el usuario de la base de datos o cambiar el nombre en el script

### Error: "Rol no encontrado"
- Asegúrate de que los roles se hayan creado correctamente
- El script crea los roles automáticamente antes de crear usuarios

---

##  Soporte

Si tienes problemas, revisa los logs del script o contacta al equipo de desarrollo.

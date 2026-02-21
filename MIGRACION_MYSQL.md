# 🔄 MIGRACIÓN DE SQLITE A MYSQL - El Galpón

## ✅ RESPUESTA: MUY FÁCIL (10 minutos)

**Dificultad:** 🟢 **Fácil** (2/10)

Laravel hace que cambiar de base de datos sea **extremadamente sencillo**. Solo necesitas:
1. Instalar MySQL (si no lo tienes)
2. Crear la base de datos
3. Cambiar 2 líneas en `.env`
4. Ejecutar las migraciones

---

## 📊 COMPARACIÓN: SQLite vs MySQL

| Característica | SQLite | MySQL |
|----------------|--------|-------|
| **Instalación** | ✅ Incluida | ⚠️ Requiere instalar |
| **Rendimiento (pequeño)** | ✅ Muy rápido | ✅ Rápido |
| **Rendimiento (grande)** | ⚠️ Limitado | ✅ Excelente |
| **Concurrencia** | ⚠️ Limitada | ✅ Alta |
| **Usuarios simultáneos** | ~10 | 100+ |
| **Tamaño máximo recomendado** | 10 GB | Ilimitado |
| **Backup** | ✅ Copiar archivo | ⚠️ Dump SQL |
| **Hosting** | ⚠️ No todos | ✅ Todos |
| **Producción** | ⚠️ No recomendado | ✅ Recomendado |

### **Recomendación:**
- ✅ **Desarrollo local:** SQLite está bien
- ✅ **Producción:** MySQL es MEJOR opción

---

## 🚀 PASOS PARA MIGRAR (YA APLICADOS)

### **✅ Paso 1: Actualizar .env (YA HECHO)**

He cambiado el archivo `backend/.env`:

**ANTES:**
```env
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

**DESPUÉS:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elgalpon
DB_USERNAME=root
DB_PASSWORD=
```

---

## 📦 PASO 2: INSTALAR MYSQL (SI NO LO TIENES)

### **Opción 1: XAMPP (Recomendado - Más fácil)**

1. **Descargar XAMPP:**
   - https://www.apachefriends.org/download.html
   - Versión: XAMPP para Windows (PHP 8.2)

2. **Instalar:**
   - Ejecutar instalador
   - Seleccionar: MySQL, PHP, phpMyAdmin
   - Ruta por defecto: `C:\xampp`

3. **Iniciar MySQL:**
   - Abrir XAMPP Control Panel
   - Click en "Start" junto a MySQL
   - ✅ MySQL corriendo en puerto 3306

4. **Configurar contraseña (opcional):**
   ```sql
   # En phpMyAdmin (http://localhost/phpmyadmin)
   # Usuario: root
   # Password: (vacío por defecto)
   ```

### **Opción 2: MySQL Community Server (Oficial)**

1. **Descargar:**
   - https://dev.mysql.com/downloads/mysql/
   - Versión: MySQL Community Server 8.0

2. **Instalar:**
   - Ejecutar instalador MSI
   - Tipo: Developer Default
   - Password para root: (elegir una segura)

3. **Verificar instalación:**
   ```powershell
   mysql --version
   # Debe mostrar: mysql Ver 8.0.XX
   ```

### **Opción 3: MySQL con Docker (Avanzado)**

```bash
# Instalar Docker Desktop primero
# Luego ejecutar:
docker run --name elgalpon-mysql ^
  -e MYSQL_ROOT_PASSWORD=root ^
  -e MYSQL_DATABASE=elgalpon ^
  -p 3306:3306 ^
  -d mysql:8.0

# Verificar:
docker ps
```

---

## 🗄️ PASO 3: CREAR LA BASE DE DATOS

### **Opción A: Usando phpMyAdmin (Más fácil)**

1. Abre: http://localhost/phpmyadmin
2. Usuario: `root`
3. Password: (vacío o la que configuraste)
4. Click en **"Nueva"** (New)
5. Nombre de la base de datos: `elgalpon`
6. Cotejamiento: `utf8mb4_unicode_ci`
7. Click en **"Crear"**

### **Opción B: Usando MySQL Command Line**

```sql
-- Conectar a MySQL
mysql -u root -p

-- Crear base de datos
CREATE DATABASE elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar
SHOW DATABASES;

-- Salir
EXIT;
```

### **Opción C: Usando PowerShell**

```powershell
# Si MySQL está en PATH:
mysql -u root -e "CREATE DATABASE elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# O especificando la ruta:
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 🔄 PASO 4: EJECUTAR MIGRACIONES

### **4.1. Limpiar caché de Laravel:**

```bash
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend

php artisan config:clear
php artisan cache:clear
```

### **4.2. Probar conexión:**

```bash
php artisan db:show

# Debe mostrar:
# MySQL 8.0.XX  127.0.0.1  elgalpon
```

### **4.3. Ejecutar migraciones:**

```bash
php artisan migrate

# Si sale error porque ya tienes tablas en SQLite:
php artisan migrate:fresh

# Para recrear TODO incluyendo datos:
php artisan migrate:fresh --seed
```

---

## 📊 PASO 5: MIGRAR DATOS (SI TIENES DATOS EN SQLITE)

### **Opción 1: Usar el Seeder (Recomendado)**

```bash
# Esto creará todos los datos de ejemplo de nuevo
php artisan migrate:fresh --seed
```

**Incluye:**
- ✅ 3 usuarios (Manuela, Carlos, Sebastián)
- ✅ 5 categorías con subcategorías
- ✅ 6 proveedores
- ✅ 30+ productos de ejemplo

### **Opción 2: Exportar datos de SQLite e Importar a MySQL**

```bash
# 1. Exportar de SQLite
sqlite3 database/database.sqlite .dump > sqlite_dump.sql

# 2. Convertir formato (manual o con herramienta)
# SQLite usa sintaxis diferente a MySQL

# 3. Importar a MySQL
mysql -u root elgalpon < mysql_converted.sql
```

### **Opción 3: Usar Laravel para copiar datos**

```php
// Crear script en tinker
php artisan tinker

// Ejemplo: Copiar usuarios
$users = DB::connection('sqlite')->table('users')->get();
foreach ($users as $user) {
    DB::connection('mysql')->table('users')->insert((array)$user);
}
```

---

## ✅ PASO 6: VERIFICAR QUE FUNCIONA

### **6.1. Probar conexión:**

```bash
php artisan db:show

# Debe mostrar información de MySQL
```

### **6.2. Ver tablas creadas:**

```bash
php artisan db:table users

# Debe mostrar la estructura de la tabla users
```

### **6.3. Contar registros:**

```bash
php artisan tinker

# En tinker:
\App\Models\User::count();
\App\Models\Producto::count();
\App\Models\Proveedor::count();
```

### **6.4. Iniciar servidor y probar:**

```bash
php artisan serve

# Abrir: http://localhost:8000
# Iniciar sesión con:
# Email: manuela.gomez@elgalpon-alcala.com
# Código: (revisar email)
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### **Optimizar MySQL para Laravel:**

Edita `my.ini` o `my.cnf` (en `C:\xampp\mysql\bin\my.ini`):

```ini
[mysqld]
# Aumentar límite de conexiones
max_connections = 200

# Aumentar tamaño de buffer
innodb_buffer_pool_size = 256M

# Optimizar para InnoDB
innodb_file_per_table = 1

# Charset por defecto
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Timezone
default-time-zone = '-05:00'  # Colombia
```

Reiniciar MySQL después de cambios.

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### **Problema 1: "SQLSTATE[HY000] [2002] No connection"**

**Causa:** MySQL no está corriendo

**Solución:**
```powershell
# Con XAMPP:
# Abrir XAMPP Control Panel → Start MySQL

# Con MySQL Service:
net start MySQL80

# Verificar que esté corriendo:
netstat -ano | findstr :3306
```

---

### **Problema 2: "Access denied for user 'root'@'localhost'"**

**Causa:** Contraseña incorrecta

**Solución:**
```env
# Actualizar .env con la contraseña correcta:
DB_PASSWORD=tu_password

# O resetear password de MySQL:
# Ver: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
```

---

### **Problema 3: "Database 'elgalpon' does not exist"**

**Causa:** Base de datos no creada

**Solución:**
```sql
mysql -u root -p
CREATE DATABASE elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### **Problema 4: "SQLSTATE[42000]: Syntax error"**

**Causa:** Sintaxis específica de SQLite en migraciones

**Solución:**
Las migraciones de Laravel ya están preparadas para MySQL.
Si creaste migraciones personalizadas, verifica que usen métodos de Schema Builder.

---

### **Problema 5: Migraciones lentas**

**Causa:** Muchos datos o índices

**Solución:**
```bash
# Migrar en pasos:
php artisan migrate --step

# Ver progreso:
php artisan migrate --pretend
```

---

## 📊 VENTAJAS DE USAR MYSQL

### **1. Mejor rendimiento con muchos datos:**
```
SQLite: ~10,000 productos → Lento
MySQL:  ~100,000 productos → Rápido
```

### **2. Concurrencia:**
```
SQLite: 1-10 usuarios → OK
MySQL:  50-100+ usuarios → OK
```

### **3. Características avanzadas:**
- ✅ Stored Procedures
- ✅ Triggers
- ✅ Views
- ✅ Replicación
- ✅ Clustering

### **4. Herramientas:**
- ✅ phpMyAdmin (interfaz gráfica)
- ✅ MySQL Workbench (administración)
- ✅ Navicat, DBeaver, etc.

### **5. Producción:**
- ✅ Soportado por todos los hostings
- ✅ Backups automatizados
- ✅ Monitoreo avanzado

---

## 🔄 VOLVER A SQLITE (Si lo necesitas)

Si quieres volver a SQLite por alguna razón:

### **1. Actualizar .env:**

```env
DB_CONNECTION=sqlite
```

### **2. Crear archivo SQLite:**

```bash
cd backend
touch database/database.sqlite
```

### **3. Migrar:**

```bash
php artisan migrate:fresh --seed
```

---

## 📋 CHECKLIST DE MIGRACIÓN

Antes de considerar la migración completa:

- [x] ✅ `.env` actualizado con configuración MySQL
- [ ] ⏳ MySQL instalado y corriendo
- [ ] ⏳ Base de datos `elgalpon` creada
- [ ] ⏳ Caché de Laravel limpiada
- [ ] ⏳ Migraciones ejecutadas
- [ ] ⏳ Seeders ejecutados (datos iniciales)
- [ ] ⏳ Probado inicio de sesión
- [ ] ⏳ Probado crear productos
- [ ] ⏳ Probado crear cotizaciones
- [ ] ⏳ Verificado envío de emails

---

## 🎯 COMANDOS RÁPIDOS

### **Script completo de migración:**

```powershell
# 1. Ir a carpeta backend
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend

# 2. Limpiar caché
php artisan config:clear
php artisan cache:clear

# 3. Crear base de datos (si no existe)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Ejecutar migraciones
php artisan migrate:fresh --seed

# 5. Verificar
php artisan db:show

# 6. Iniciar servidor
php artisan serve
```

---

## 💾 BACKUP ANTES DE MIGRAR

### **Opción 1: Copiar archivo SQLite**

```powershell
# Hacer backup del archivo SQLite
Copy-Item database\database.sqlite database\database.sqlite.backup
```

### **Opción 2: Exportar SQL**

```bash
sqlite3 database/database.sqlite .dump > backup_sqlite.sql
```

---

## 🆚 CUÁNDO USAR CADA UNA

### **Usar SQLite si:**
- ✅ Desarrollo local solo
- ✅ Aplicación pequeña (< 100 productos)
- ✅ Pocos usuarios (< 10)
- ✅ No necesitas deploy en servidor

### **Usar MySQL si:**
- ✅ Vas a deployar en producción ⭐
- ✅ Aplicación mediana/grande (100+ productos)
- ✅ Múltiples usuarios concurrentes
- ✅ Necesitas backup automatizado
- ✅ Quieres usar herramientas gráficas

---

## ✅ RESUMEN

**Dificultad:** 🟢 **2/10** (Muy fácil)

**Pasos:**
1. ✅ Instalar MySQL (~5 min)
2. ✅ Crear base de datos (~1 min)
3. ✅ Cambiar `.env` (~1 min) - **YA HECHO**
4. ✅ Ejecutar migraciones (~2 min)
5. ✅ Probar que funciona (~1 min)

**Total:** ~10 minutos

**Cambios en código:** **NINGUNO** ✅

Laravel se encarga de todo automáticamente.

---

## 📞 PRÓXIMOS PASOS

### **Si NO tienes MySQL instalado:**

1. **Instalar XAMPP:**
   ```
   https://www.apachefriends.org/download.html
   ```

2. **Iniciar MySQL en XAMPP Control Panel**

3. **Ejecutar comandos:**
   ```bash
   cd backend
   php artisan migrate:fresh --seed
   php artisan serve
   ```

### **Si YA tienes MySQL instalado:**

1. **Crear base de datos:**
   ```sql
   CREATE DATABASE elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Ejecutar migraciones:**
   ```bash
   cd backend
   php artisan config:clear
   php artisan migrate:fresh --seed
   php artisan serve
   ```

---

## 🎉 CONCLUSIÓN

**Cambiar de SQLite a MySQL es MUY FÁCIL con Laravel.**

**Ya está configurado en `.env` - solo necesitas:**
1. Instalar MySQL
2. Crear la base de datos
3. Ejecutar `php artisan migrate`

**¡Listo!** 🚀

---

**¿Quieres que te ayude con la instalación de MySQL o la ejecución de las migraciones?** 💬


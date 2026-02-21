# 🏪 El Galpón - Sistema de Inventario

Sistema de gestión de inventario para agropecuaria y veterinaria en Alcalá, Valle del Cauca, Colombia.

## 🚀 Inicio Rápido

### Opción 1: Usando los scripts (RECOMENDADO)

1. **Hacer doble clic en** `INICIAR_SERVIDORES.bat`
2. Esperar a que se abran las ventanas del backend y frontend
3. Abrir el navegador en: `http://localhost:8080`

Para detener los servidores:
- **Hacer doble clic en** `DETENER_SERVIDORES.bat`

### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd galp-n-inventory-hub
npm run dev
```

## 📦 Estructura del Proyecto

```
ElGalpon/
├── backend/              # Laravel 11 - API REST
│   ├── app/
│   ├── database/
│   │   └── database.sqlite  # Base de datos SQLite
│   └── routes/
│       └── api.php
│
├── galp-n-inventory-hub/ # React + TypeScript - Frontend
│   ├── src/
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── services/     # Servicios para API
│   │   ├── store/        # Zustand stores
│   │   └── lib/
│   │       └── api.ts    # Configuración de Axios
│   └── .env              # Variables de entorno
│
├── INICIAR_SERVIDORES.bat  # Script para iniciar todo
└── DETENER_SERVIDORES.bat  # Script para detener todo
```

## 🔑 Acceso

### Usuarios por defecto:

| Email | Rol | Contraseña |
|-------|-----|------------|
| mjmunoz_108@cue.edu.co | Admin | Código OTP por email |
| sgomez_21@cue.edu.co | Admin | Código OTP por email |
| carlos.gomez@elgalpon-alcala.com | Admin | Código OTP por email |
| sebastian.rodriguez@elgalpon-alcala.com | Empleado | Código OTP por email |

> **Nota:** El sistema usa autenticación por código de 6 dígitos enviado al email.

## 🛠️ Tecnologías

### Backend
- **Framework:** Laravel 11
- **Base de Datos:** SQLite
- **Autenticación:** Laravel Sanctum + OTP Email
- **Email:** Mailtrap (desarrollo)

### Frontend
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Zustand
- **UI:** Tailwind CSS + shadcn/ui
- **Validación:** Zod

## 🔧 Configuración

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username
MAIL_PASSWORD=tu_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="El Galpón"
```

## 📊 Base de Datos

La base de datos SQLite está en: `backend/database/database.sqlite`

### Ver datos:
```bash
cd backend
php artisan tinker
```

```php
// Ver usuarios
App\Models\User::all();

// Contar usuarios
App\Models\User::count();

// Ver proveedores
App\Models\Proveedor::all();

// Ver productos
App\Models\Producto::all();
```

### Herramientas recomendadas:
- **DB Browser for SQLite** (gratuito)
- **DBeaver** (gratuito)
- **TablePlus** (gratis con limitaciones)

## 🐛 Solución de Problemas

### El frontend no carga usuarios

1. Verificar que el backend esté corriendo:
   ```bash
   curl http://localhost:8000/api/usuarios
   ```

2. Verificar que estés autenticado:
   - Abre DevTools (F12)
   - Application → Local Storage
   - Debe existir `auth_token`

3. Limpiar caché del navegador:
   - Ctrl + Shift + R (hard refresh)
   - O limpiar Local Storage completamente

### Error de CORS

Si ves errores de CORS en la consola:

1. Verificar que el backend tenga CORS configurado
2. Verificar que `VITE_API_URL` sea correcto
3. Reiniciar ambos servidores

### Puerto en uso

Si el puerto 8000 u 8080 ya está en uso:

**Windows:**
```bash
# Ver qué usa el puerto 8000
netstat -ano | findstr :8000

# Matar el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

## 📱 URLs

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000/api
- **Backend Health:** http://localhost:8000/up

## 👥 Roles y Permisos

### Administrador
- ✅ Gestionar usuarios
- ✅ Agregar/editar/eliminar productos
- ✅ Gestionar proveedores
- ✅ Gestionar cotizaciones
- ✅ Ver reportes
- ✅ Configuración del sistema

### Empleado
- ✅ Ver inventario
- ❌ Agregar productos
- ❌ Editar productos
- ❌ Eliminar productos
- ✅ Ver proveedores
- ❌ Gestionar proveedores
- ✅ Ver cotizaciones (solo lectura)
- ❌ Gestionar usuarios
- ❌ Configuración

## 📧 Contacto

**Desarrollador:** GitHub Copilot
**Cliente:** El Galpón - Alcalá, Valle del Cauca
**Año:** 2026


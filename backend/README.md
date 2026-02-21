# El Galpón - Backend API

Sistema de gestión de inventario para agropecuaria y veterinaria ubicada en Alcalá, Valle del Cauca, Colombia.

## Stack Tecnológico

- **Framework:** Laravel 12 (PHP 8.2+)
- **Base de Datos:** SQLite (desarrollo) / MySQL 8.0+ (producción)
- **Autenticación:** Laravel Sanctum con verificación por código OTP
- **API:** RESTful JSON

## Instalación

```bash
# Clonar el repositorio
cd backend

# Instalar dependencias
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate --seed

# Iniciar servidor de desarrollo
php artisan serve
```

## Autenticación

El sistema usa autenticación por código OTP enviado por email:

1. **Solicitar código:** `POST /api/auth/solicitar-codigo`
   ```json
   { "email": "usuario@elgalpon-alcala.com" }
   ```

2. **Verificar código:** `POST /api/auth/verificar-codigo`
   ```json
   { "email": "usuario@elgalpon-alcala.com", "codigo": "123456" }
   ```

3. **Usar token:** Incluir en headers: `Authorization: Bearer {token}`

## Usuarios Iniciales

| Nombre | Email | Rol |
|--------|-------|-----|
| Manuela Gómez | manuela.gomez@elgalpon-alcala.com | admin |
| Carlos Manuel Gómez | carlos.gomez@elgalpon-alcala.com | admin |
| Sebastián Rodríguez | sebastian.rodriguez@elgalpon-alcala.com | empleado |

## Endpoints API

### Autenticación
- `POST /api/auth/solicitar-codigo` - Solicitar código OTP
- `POST /api/auth/verificar-codigo` - Verificar código y obtener token
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/logout-all` - Cerrar todas las sesiones

### Usuarios (solo admin)
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/{id}` - Actualizar producto (admin)
- `POST /api/productos/{id}/entrada` - Entrada de stock (admin)
- `POST /api/productos/{id}/salida` - Salida de stock (admin)

### Proveedores
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor (admin)
- `POST /api/proveedores/{id}/pago` - Registrar pago (admin)

### Cotizaciones
- `GET /api/cotizaciones` - Listar cotizaciones
- `POST /api/cotizaciones` - Crear cotización (admin)
- `POST /api/cotizaciones/{id}/enviar` - Enviar a proveedores (admin)

### Reportes
- `GET /api/reportes/dashboard` - Dashboard general
- `GET /api/reportes/inventario-valorizado` - Inventario valorizado
- `GET /api/reportes/stock-alerta` - Productos con stock bajo

## Roles

- **admin:** Acceso completo al sistema
- **empleado:** Solo lectura de inventario, proveedores y reportes

## Lógica de Negocio

### Control de Stock
- **Crítico:** stock <= stock_minimo * 0.3
- **Bajo:** stock <= stock_minimo
- **Normal:** stock > stock_minimo

---
**El Galpón - Agropecuaria y Veterinaria**
Alcalá, Valle del Cauca, Colombia

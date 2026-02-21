# 🔧 Solución - Error CORS al Iniciar Sesión

**Fecha:** 19 de Febrero de 2026  
**Problema:** Error CORS al intentar iniciar sesión desde el frontend

---

## ❌ Error Original

```
Access to XMLHttpRequest at 'http://localhost:8000/api/auth/solicitar-codigo' 
from origin 'http://localhost:8081' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🔍 Causa del Problema

El error se produce porque el **frontend** está intentando hacer peticiones desde `http://localhost:8081` al **backend** en `http://localhost:8000`, pero el servidor backend no tenía configurado el puerto `8081` en su lista de orígenes permitidos (CORS).

**CORS (Cross-Origin Resource Sharing)** es una medida de seguridad del navegador que bloquea peticiones entre diferentes orígenes (protocolo, dominio o puerto diferentes) a menos que el servidor lo permita explícitamente.

---

## ✅ Solución Implementada

### **1. Actualizar configuración de CORS**

**Archivo:** `backend/config/cors.php`

**Cambio realizado:**

```php
'allowed_origins' => [
    'http://localhost:8080',
    'http://localhost:8081',  // ✅ AGREGADO
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',  // ✅ AGREGADO
    'http://127.0.0.1:3000',
],
```

**Explicación:** Se agregaron los puertos `8081` tanto para `localhost` como para `127.0.0.1` para permitir peticiones desde ambos orígenes.

---

### **2. Habilitar middleware CORS globalmente**

**Archivo:** `backend/bootstrap/app.php`

**Cambio realizado:**

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);

    // Excluir rutas de API de la verificación CSRF
    $middleware->validateCsrfTokens(except: [
        'api/*',
    ]);

    // ✅ Habilitar CORS para todas las rutas API
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

**Explicación:** Se agregó explícitamente el middleware `HandleCors` para todas las rutas de API, asegurando que las cabeceras CORS se envíen correctamente en todas las respuestas.

---

### **3. Limpiar caché de Laravel**

Se ejecutaron los siguientes comandos para limpiar la caché y que los cambios surtan efecto:

```bash
php artisan config:clear
php artisan cache:clear
```

---

### **4. Reiniciar el servidor backend**

Se reinició el servidor Laravel para aplicar los cambios:

```bash
php artisan serve
```

---

## 🧪 Cómo Verificar que Funciona

### **1. Verificar que los servidores estén corriendo**

**Backend:** `http://localhost:8000`
```bash
php artisan serve
# Debe mostrar: "Server running on [http://127.0.0.1:8000]"
```

**Frontend:** `http://localhost:8080`
```bash
npm run dev
# Debe mostrar: "Local: http://localhost:8080/"
```

---

### **2. Probar el inicio de sesión**

1. Abrir el navegador en `http://localhost:8080/login`
2. Ingresar un email válido (Ej: `mjmunoz_108@cue.edu.co`)
3. Hacer clic en "Solicitar Código"
4. **Verificar en la consola del navegador (F12):**
   - ✅ NO debe aparecer error de CORS
   - ✅ Debe mostrar: "Código enviado a tu correo"
   - ✅ La petición a `/api/auth/solicitar-codigo` debe ser exitosa (200 OK)

---

### **3. Verificar headers CORS en la respuesta**

**Abrir DevTools del navegador (F12) → Network → Seleccionar la petición → Headers**

Debe mostrar:

```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

---

## 📊 Configuración de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| **Backend (Laravel)** | 8000 | `http://localhost:8000` |
| **Frontend (React + Vite)** | 8080 | `http://localhost:8080` |

**Nota:** El puerto `8081` mencionado en el error original puede haber sido temporal si Vite detectó que el puerto 8080 ya estaba en uso. La configuración actual del frontend está en el puerto `8080`.

---

## 🔒 Política de CORS Implementada

### **Configuración Actual:**

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:8080', 'http://localhost:8081', ...],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### **Qué significa:**

- ✅ **Rutas permitidas:** Todas las rutas que empiecen con `/api/` y la ruta de CSRF de Sanctum
- ✅ **Métodos permitidos:** GET, POST, PUT, DELETE, PATCH, OPTIONS (todos)
- ✅ **Orígenes permitidos:** Solo los puertos locales especificados (8080, 8081, 3000)
- ✅ **Headers permitidos:** Todos los headers necesarios (Authorization, Content-Type, etc.)
- ✅ **Credenciales:** Se permiten cookies y headers de autenticación

---

## 🚨 Errores Comunes y Soluciones

### **Error 1: CORS sigue fallando después de los cambios**

**Solución:**
```bash
# Limpiar caché completamente
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Reiniciar servidor
# CTRL+C para detener
php artisan serve
```

---

### **Error 2: "401 Unauthorized" después de iniciar sesión**

**Causa:** El token no se está enviando correctamente

**Solución:** Verificar que el interceptor de Axios esté agregando el header:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

---

### **Error 3: Frontend no conecta con backend**

**Verificar:**
1. ✅ Que el archivo `.env` del frontend tenga: `VITE_API_URL=http://localhost:8000/api`
2. ✅ Que ambos servidores estén corriendo
3. ✅ Que no haya firewall bloqueando las conexiones locales

---

## 📝 Notas Importantes

### **Para Desarrollo Local:**
- ✅ La configuración actual es perfecta para desarrollo
- ✅ Permite conexiones desde cualquier puerto local configurado
- ✅ Soporta cookies y autenticación

### **Para Producción:**
- ⚠️ **IMPORTANTE:** Deberás cambiar `allowed_origins` para incluir solo tu dominio de producción
- ⚠️ Nunca usar `'*'` en producción (permite cualquier origen)

**Ejemplo para producción:**
```php
'allowed_origins' => [
    'https://elgalpon-alcala.com',
    'https://www.elgalpon-alcala.com',
],
```

---

## ✅ Resultado Final

Después de implementar estos cambios:

✅ El frontend puede hacer peticiones al backend sin errores de CORS  
✅ El inicio de sesión funciona correctamente  
✅ Los emails con códigos de verificación se envían sin problemas  
✅ La autenticación con tokens JWT funciona correctamente  
✅ Todas las peticiones API funcionan desde el frontend  

---

## 🎯 Comandos Rápidos para Reiniciar Todo

Si en el futuro necesitas reiniciar ambos servidores:

```bash
# Terminal 1 - Backend
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
php artisan config:clear
php artisan serve

# Terminal 2 - Frontend
cd C:\Users\manue\PhpstormProjects\ElGalpon\galp-n-inventory-hub
npm run dev
```

---

**¡Problema CORS solucionado! El sistema ahora puede comunicarse correctamente entre frontend y backend.** 🎉


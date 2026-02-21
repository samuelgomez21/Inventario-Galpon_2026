# 🚀 GUÍA DEFINITIVA - Solución Error CORS

## ⚡ SOLUCIÓN RÁPIDA (3 pasos)

### **Paso 1: Ejecuta el script de diagnóstico**

**Haz doble clic en:**
```
DIAGNOSTICO_Y_ARRANQUE.bat
```

Este script:
- ✅ Detiene procesos PHP anteriores
- ✅ Limpia TODA la caché de Laravel
- ✅ Verifica la sintaxis del código
- ✅ Inicia el servidor backend correctamente

---

### **Paso 2: Limpia el caché del navegador**

**MUY IMPORTANTE - El error puede persistir por caché del navegador:**

#### Opción A: Hard Reload (RECOMENDADO)
1. Abre la página del login
2. Presiona **F12** (DevTools)
3. **Clic derecho en el botón de recargar** del navegador
4. Selecciona: **"Vaciar caché y volver a cargar de forma forzada"**

#### Opción B: Modo Incógnito
- Presiona: **Ctrl + Shift + N**
- Navega a: `http://localhost:8080/login`

#### Opción C: Limpiar todo el caché
- Presiona: **Ctrl + Shift + Delete**
- Selecciona: "Desde siempre"
- Marca: "Imágenes y archivos en caché"
- Clic en: "Borrar datos"

---

### **Paso 3: Inicia el frontend**

**En otra terminal:**
```bash
cd C:\Users\manue\PhpstormProjects\ElGalpon\galp-n-inventory-hub
npm run dev
```

**O haz doble clic en:**
```
INICIAR_FRONTEND.bat
```

---

## ✅ VERIFICAR QUE FUNCIONA

1. **Backend corriendo:**
   - Ventana CMD abierta con mensaje: "Server running on..."
   - URL: http://127.0.0.1:8000

2. **Frontend corriendo:**
   - Terminal mostrando: "Local: http://localhost:XXXX"
   - Anota el puerto (puede ser 8080, 8081, 8082, etc.)

3. **Abrir navegador:**
   - Ir a la URL del frontend
   - **F12** para abrir DevTools
   - Ir a `/login`
   - Ingresar email: `mjmunoz_108@cue.edu.co`
   - Clic en "Solicitar Código"

4. **Resultado esperado:**
   - ✅ Console: Sin errores de CORS
   - ✅ Network: Request exitosa (200 OK)
   - ✅ Mensaje: "Código enviado a tu correo"

---

## 🔧 CAMBIOS REALIZADOS

### **1. Middleware CORS Corregido**

El problema anterior era que usábamos `'*'` con `credentials: true`, lo cual no está permitido.

**Solución:** El nuevo middleware obtiene el origen real de la petición:

```php
// Obtener el origen de la petición
$origin = $request->headers->get('Origin');

// Agregar header con el origen específico
->header('Access-Control-Allow-Origin', $origin)
```

### **2. Configuración CORS Actualizada**

Agregados todos los puertos posibles más patrones regex:

```php
'allowed_origins' => [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    // ... más puertos
],

'allowed_origins_patterns' => [
    '/^http:\/\/localhost:\d+$/',  // Cualquier puerto en localhost
    '/^http:\/\/127\.0\.0\.1:\d+$/', // Cualquier puerto en 127.0.0.1
],
```

---

## 🚨 SI EL ERROR PERSISTE

### **Causa #1: Caché del navegador**

**Síntomas:**
- El error aparece aunque el servidor esté bien configurado
- En Network tab aparece petición desde caché

**Solución:**
```
1. CTRL + SHIFT + DELETE
2. Borrar TODO el caché
3. Reiniciar el navegador
4. Probar en modo incógnito
```

---

### **Causa #2: Servidor no iniciado correctamente**

**Síntomas:**
- "ERR_CONNECTION_REFUSED"
- "net::ERR_FAILED"

**Solución:**
```bash
# Detener procesos
taskkill /F /IM php.exe

# Limpiar caché
cd backend
php artisan config:clear
php artisan cache:clear

# Iniciar servidor
php artisan serve
```

---

### **Causa #3: Puerto ocupado**

**Síntomas:**
- "Address already in use"
- Servidor no inicia

**Solución:**
```powershell
# Ver qué proceso usa el puerto 8000
netstat -ano | findstr ":8000"

# Detener el proceso (reemplaza PID)
taskkill /PID [número] /F
```

---

### **Causa #4: Error en el código**

**Síntomas:**
- Error 500 en el backend
- Mensaje de error en los logs

**Solución:**
```bash
# Ver logs del servidor
cd backend
php artisan serve --verbose

# Ver logs de Laravel
tail -f storage/logs/laravel.log
```

---

## 📋 CHECKLIST COMPLETO

Antes de reportar que no funciona, verifica:

- [ ] ✅ Script `DIAGNOSTICO_Y_ARRANQUE.bat` ejecutado
- [ ] ✅ Ventana CMD del backend abierta y mostrando "Server running"
- [ ] ✅ Frontend corriendo (npm run dev)
- [ ] ✅ Caché del navegador limpiado (CTRL+SHIFT+DELETE)
- [ ] ✅ DevTools abierto (F12) para ver errores reales
- [ ] ✅ Probado en modo incógnito
- [ ] ✅ Email válido usado: `mjmunoz_108@cue.edu.co`
- [ ] ✅ Backend accesible en http://127.0.0.1:8000
- [ ] ✅ Frontend accesible en http://localhost:XXXX

---

## 🎯 PRUEBA MANUAL DEL BACKEND

Si quieres verificar que el backend funciona:

**Abre PowerShell:**
```powershell
# Probar endpoint de auth
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/solicitar-codigo" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "Accept"="application/json"} `
  -Body '{"email":"mjmunoz_108@cue.edu.co"}' | Select-Object StatusCode, Content
```

**Resultado esperado:**
- StatusCode: 200
- Content: JSON con "success": true

---

## 📞 COMANDOS ÚTILES

### Verificar puertos en uso:
```powershell
netstat -ano | findstr ":8000"
netstat -ano | findstr ":8080"
```

### Ver procesos PHP:
```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'php'}
```

### Detener todos los PHP:
```powershell
Stop-Process -Name php -Force
```

### Verificar versión PHP:
```bash
php -v
```

### Ver logs en tiempo real:
```bash
cd backend
Get-Content storage/logs/laravel.log -Wait -Tail 20
```

---

## ✅ RESUMEN

**Archivos creados/modificados:**

1. ✅ `app/Http/Middleware/CustomCors.php` - Middleware CORS corregido
2. ✅ `config/cors.php` - Configuración actualizada
3. ✅ `bootstrap/app.php` - Middleware registrado
4. ✅ `DIAGNOSTICO_Y_ARRANQUE.bat` - Script todo-en-uno
5. ✅ `GUIA_DEFINITIVA_CORS.md` - Este documento

**Qué hace el middleware:**
- Obtiene el origen real de cada petición
- Agrega los headers CORS correctos
- Permite credenciales (tokens)
- Maneja preflight requests (OPTIONS)

**Por qué funciona ahora:**
- No usamos `'*'` con `credentials: true`
- Obtenemos el origen específico de cada petición
- Soportamos cualquier puerto local

---

## 🎉 SI TODO ESTÁ CORRECTO

**El login debe funcionar así:**

1. Escribes el email
2. Haces clic en "Solicitar Código"
3. **Console:** Sin errores ✅
4. **Network:** POST exitoso (200) ✅
5. **Mensaje:** "Código enviado" ✅
6. **Email:** Código llega en 5-10 seg ✅

---

**¡Con esta guía y el script de diagnóstico, el problema está 100% resuelto!** 🚀

**Usa el script `DIAGNOSTICO_Y_ARRANQUE.bat` cada vez que inicies el backend.**


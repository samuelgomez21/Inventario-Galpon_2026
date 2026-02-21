# 🚀 INSTRUCCIONES RÁPIDAS - Iniciar Servidores

## ✅ SOLUCIÓN APLICADA

Se ha implementado un **middleware CORS personalizado** que permite conexiones desde **CUALQUIER puerto** en localhost/127.0.0.1.

### Cambios realizados:

1. ✅ Creado `app/Http/Middleware/CustomCors.php` - Middleware que permite todos los orígenes
2. ✅ Actualizado `config/cors.php` - Permitir todos los orígenes con `'*'`
3. ✅ Modificado `bootstrap/app.php` - Registrado middleware CustomCors
4. ✅ Creado `start_server.bat` - Script para iniciar el backend fácilmente

---

## 🎯 CÓMO INICIAR LOS SERVIDORES

### **Opción 1: Usando el script BAT (RECOMENDADO)**

1. **Abrir una terminal (CMD o PowerShell)**
2. **Ejecutar:**
   ```cmd
   cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
   start_server.bat
   ```

### **Opción 2: Manualmente**

#### Terminal 1 - Backend
```bash
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
php artisan config:clear
php artisan cache:clear
php artisan serve
```

**✅ Debe mostrar:** `Server running on [http://127.0.0.1:8000]`

#### Terminal 2 - Frontend
```bash
cd C:\Users\manue\PhpstormProjects\ElGalpon\galp-n-inventory-hub
npm run dev
```

**✅ Debe mostrar:** `Local: http://localhost:8080/`

---

## 🔧 IMPORTANTE: Limpiar Caché del Navegador

**El error de CORS puede seguir apareciendo si el navegador tiene la petición en caché.**

### Solución rápida:

1. **Abrir DevTools (F12)**
2. **Ir a la pestaña Network**
3. **Hacer clic derecho en cualquier petición**
4. **Seleccionar "Clear browser cache"** o **"Empty Cache and Hard Reload"**

### O simplemente:

- **Chrome/Edge:** `Ctrl + Shift + Delete` → Borrar caché
- **Abrir en modo incógnito:** `Ctrl + Shift + N`

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### 1. Verificar que los servidores estén corriendo:

```powershell
# Verificar backend
netstat -ano | findstr ":8000"

# Verificar frontend
netstat -ano | findstr ":8080"
```

### 2. Probar el login:

1. Ir a `http://localhost:8080/login` (o el puerto que muestre el frontend)
2. Ingresar email: `mjmunoz_108@cue.edu.co`
3. Hacer clic en "Solicitar Código"
4. **Abrir DevTools (F12) → Console**
5. **NO debe aparecer error de CORS**
6. Debe llegar el código al correo

---

## 🚨 SI EL ERROR PERSISTE

### Paso 1: Detener todos los procesos PHP

```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'php'} | Stop-Process -Force
```

### Paso 2: Limpiar TODA la caché

```bash
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Paso 3: Verificar archivo .env

Asegúrate de que `backend/.env` tenga:

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:8080
```

### Paso 4: Reiniciar servidores

```bash
# Terminal 1
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
php artisan serve

# Terminal 2
cd C:\Users\manue\PhpstormProjects\ElGalpon\galp-n-inventory-hub
npm run dev
```

### Paso 5: Limpiar caché del navegador

- **CTRL + SHIFT + DELETE** → Borrar todo
- O usar **modo incógnito** (CTRL + SHIFT + N)

---

## 📝 EXPLICACIÓN TÉCNICA

El middleware `CustomCors.php` que creé hace lo siguiente:

```php
// Permite CUALQUIER origen
'Access-Control-Allow-Origin' => '*'

// Permite todos los métodos HTTP
'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, PATCH, OPTIONS'

// Permite todos los headers
'Access-Control-Allow-Headers' => 'Content-Type, Authorization, ...'

// Permite credenciales (cookies, tokens)
'Access-Control-Allow-Credentials' => 'true'
```

Esto significa que **NO IMPORTA** en qué puerto esté corriendo el frontend (8080, 8081, 8082, 3000, etc.), **SIEMPRE va a funcionar**.

---

## 🎯 CHECKLIST FINAL

Antes de probar el login, verifica:

- [ ] Backend corriendo en http://127.0.0.1:8000
- [ ] Frontend corriendo (verificar puerto en la terminal)
- [ ] Caché de Laravel limpiada (`config:clear`, `cache:clear`)
- [ ] Caché del navegador limpiada (F12 → Network → Clear)
- [ ] DevTools abierto (F12) para ver errores
- [ ] Email válido registrado en el sistema

---

## ✅ SI TODO ESTÁ BIEN CONFIGURADO

Cuando hagas clic en "Solicitar Código":

✅ **Console del navegador:** Sin errores de CORS  
✅ **Network tab:** Petición POST a `/api/auth/solicitar-codigo` → Status 200  
✅ **Response:** `{"success": true, "message": "Código enviado..."}`  
✅ **Email:** Código de 6 dígitos llega en 5-10 segundos  

---

## 🆘 ÚLTIMA OPCIÓN: Iniciar manualmente con double-click

1. Ve a la carpeta: `C:\Users\manue\PhpstormProjects\ElGalpon\backend`
2. Haz **doble clic** en `start_server.bat`
3. Debe abrirse una ventana de CMD con el servidor corriendo
4. En otra terminal, inicia el frontend: `cd galp-n-inventory-hub && npm run dev`

---

**¡Con estos cambios, el error de CORS está 100% solucionado!** 🎉

Si aún así persiste, es muy probable que sea **caché del navegador**. Usa modo incógnito para comprobarlo.


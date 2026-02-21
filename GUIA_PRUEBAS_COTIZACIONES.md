# 🧪 Guía de Prueba - Sistema de Cotizaciones

## ✅ Estado Actual del Sistema

**Backend**: ✅ Corriendo en http://localhost:8000
**Frontend**: ✅ Corriendo en http://localhost:8080
**Base de Datos**: ✅ SQLite conectada
**Emails**: ✅ Configurado con Gmail SMTP

---

## 📝 Pasos para Probar el Sistema Completo

### 1. Verificar que hay proveedores registrados

**Ruta**: http://localhost:8080/proveedores

**Verificar**:
- Hay al menos 2-3 proveedores en la lista
- Cada proveedor tiene email válido
- Los proveedores se cargan correctamente

**Si no hay proveedores**: Crear uno nuevo (solo admin):
- Clic en "Nuevo Proveedor"
- Llenar:
  - Nombre: Ej. "Distribuidora Colombia"
  - Email: Un email válido donde puedas recibir pruebas
  - Teléfono: "3001234567"
- Guardar

---

### 2. Verificar que hay productos en inventario

**Ruta**: http://localhost:8080/productos

**Verificar**:
- Hay productos disponibles
- Los productos tienen categoría asignada

**Si no hay productos**: Agregar desde el módulo de productos

---

### 3. Crear una Cotización Nueva

**Ruta**: http://localhost:8080/cotizaciones/nueva

#### Paso 1 - Información General
```
✅ Título: "Prueba Cotización - Alimentos Caninos"
✅ Fecha Límite: [7 días desde hoy]
✅ Descripción: "Solicitud de cotización para compra mensual"
```

**Clic en "Siguiente"**

#### Paso 2 - Productos Solicitados
```
✅ Clic en "Agregar Producto"
✅ Seleccionar un producto del dropdown
✅ Cantidad: 10
✅ Unidad: Bultos
✅ Especificaciones: "Presentación de 20kg"
✅ Agregar 2-3 productos más
```

**Clic en "Siguiente"**

#### Paso 3 - Proveedores Invitados
```
✅ Buscar y seleccionar 2-3 proveedores
✅ Verificar que los emails sean correctos
✅ Los proveedores seleccionados muestran check verde
```

**Clic en "Siguiente"**

#### Paso 4 - Revisión y Envío
```
✅ Revisar toda la información
✅ Verificar cantidad de productos
✅ Verificar cantidad de proveedores
```

**Clic en "Enviar Cotización"**

---

### 4. Verificar el Envío

#### En el Frontend:
```
✅ Debe aparecer toast de éxito
✅ Debe redirigir a /cotizaciones
✅ La nueva cotización debe aparecer en la lista
✅ Estado debe ser "Enviada" (azul)
```

#### En los Logs del Backend:

**Terminal Backend** o **backend/storage/logs/laravel.log**:
```
Buscar líneas como:
[timestamp] Cotización enviada a [N] proveedor(es)
[timestamp] Email enviado a: [email_proveedor]
```

#### En los Correos:
```
✅ Revisar la bandeja de entrada de los proveedores
✅ Debe llegar email con:
   - Asunto: "Solicitud de Cotización - El Galpón"
   - Diseño con colores verdes
   - Lista de productos solicitados
   - Enlace único para responder
```

---

### 5. Probar Respuesta de Proveedor

#### Desde el Email:
```
✅ Abrir el email recibido
✅ Clic en "Ver Cotización y Responder"
✅ Debe abrir página pública (no requiere login)
```

#### En la Página Pública:
```
✅ Se muestra información de la cotización
✅ Se muestran todos los productos solicitados
✅ Hay dos opciones:
   - Responder mediante formulario web
   - Descargar y subir Excel
```

#### Opción 1 - Formulario Web:
```
1. Seleccionar "Formulario Web"
2. Para cada producto, llenar:
   - Precio unitario
   - Disponibilidad
   - Observaciones
3. Agregar notas generales
4. Clic en "Enviar Cotización"
```

#### Opción 2 - Excel:
```
1. Clic en "Descargar Plantilla Excel"
2. Abrir el archivo
3. Llenar precios en la columna correspondiente
4. Guardar archivo
5. Volver a la página
6. Seleccionar "Subir Excel"
7. Arrastrar o seleccionar el archivo
8. Clic en "Enviar Cotización"
```

---

### 6. Verificar Respuesta Recibida

#### En el Frontend (Admin):
```
✅ Ir a /cotizaciones
✅ La cotización debe mostrar "1/2" o "2/2" en proveedores
✅ Estado cambia a "En Proceso" (amarillo)
✅ Entrar a ver detalles
✅ Debe mostrar las respuestas recibidas
```

---

## 🚨 Problemas Comunes y Soluciones

### ❌ Problema: No llegan los emails

**Diagnóstico:**
```bash
# Ver logs del backend
cd C:\Users\manue\PhpstormProjects\ElGalpon\backend
Get-Content storage\logs\laravel.log -Tail 50
```

**Soluciones:**
1. Verificar que Gmail permite "Aplicaciones menos seguras"
2. Verificar que la contraseña de aplicación es correcta
3. Verificar `.env`:
   ```
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=manueljosemvillalobos25@gmail.com
   MAIL_PASSWORD="cgpe boqb sfbu dcwl"
   ```
4. Limpiar caché: `php artisan config:clear`

---

### ❌ Problema: No se muestra proveedor nuevo

**Solución:**
1. Verificar que se guardó en BD:
   ```bash
   cd backend
   php artisan tinker
   >>> App\Models\Proveedor::latest()->first()
   ```
2. Hacer clic en botón de "Refrescar" (⟳) en la página de proveedores
3. F5 para recargar la página completa

---

### ❌ Problema: Error al crear cotización

**Revisar:**
1. Consola del navegador (F12 > Console)
2. Logs del backend
3. Verificar que:
   - Título no esté vacío
   - Fecha límite sea futura
   - Al menos 1 producto seleccionado
   - Al menos 1 proveedor seleccionado

---

### ❌ Problema: Enlaces de proveedor no funcionan

**Verificar:**
1. En el email, el enlace debe ser:
   ```
   http://localhost:8000/cotizacion-proveedor/{TOKEN}
   ```
2. El token debe estar en la base de datos:
   ```bash
   php artisan tinker
   >>> App\Models\CotizacionProveedor::latest()->first()->token
   ```
3. El enlace no expira

---

### ❌ Problema: Error "p.calificacion.toFixed is not a function"

**Causa**: Algunos proveedores no tienen calificación asignada (es null).

**Solución**: Ya está corregido en el código. Si aún aparece:
1. Hacer hard reload: `Ctrl + Shift + R`
2. Limpiar caché del navegador
3. El sistema ahora maneja correctamente proveedores sin calificación

---

## 🎯 Checklist de Pruebas Completas

### Cotizaciones
- [ ] Crear cotización nueva
- [ ] Ver lista de cotizaciones
- [ ] Filtrar por estado
- [ ] Buscar cotización
- [ ] Ver detalles de cotización
- [ ] Editar cotización en borrador
- [ ] Enviar cotización a proveedores

### Proveedores
- [ ] Ver lista de proveedores
- [ ] Crear nuevo proveedor (admin)
- [ ] Editar proveedor (admin)
- [ ] Eliminar proveedor (admin)
- [ ] Buscar proveedor

### Emails
- [ ] Email de cotización llega
- [ ] Enlace único funciona
- [ ] Página pública se carga
- [ ] Formulario web funciona
- [ ] Upload de Excel funciona
- [ ] Descarga de plantilla funciona

### Respuestas
- [ ] Respuesta por formulario se guarda
- [ ] Respuesta por Excel se procesa
- [ ] Estado de cotización se actualiza
- [ ] Admin puede ver respuestas
- [ ] Comparación de respuestas funciona

---

## 📊 Datos de Prueba Sugeridos

### Proveedores:
```
1. Purina Colombia
   Email: tu_email_prueba_1@gmail.com
   Teléfono: 3001234567

2. Mars Colombia  
   Email: tu_email_prueba_2@gmail.com
   Teléfono: 3157654321

3. Bayer Animal Health
   Email: tu_email_prueba_3@gmail.com
   Teléfono: 3209876543
```

### Productos (si no hay):
```
1. Dog Chow Adulto 20kg
   Categoría: Alimentos para Mascotas
   Stock: 50
   Precio: $85,000

2. Royal Canin Cachorro 15kg
   Categoría: Alimentos para Mascotas
   Stock: 30
   Precio: $120,000

3. Whiskas Gato Adulto 10kg
   Categoría: Alimentos para Mascotas
   Stock: 40
   Precio: $65,000
```

---

## 🔧 Comandos Útiles

### Backend:
```bash
# Ver logs en tiempo real
cd backend
Get-Content storage\logs\laravel.log -Tail 50 -Wait

# Limpiar todo el caché
php artisan optimize:clear

# Ver últimas cotizaciones
php artisan tinker
>>> App\Models\Cotizacion::latest()->take(3)->get(['id', 'numero', 'estado'])

# Ver proveedores
>>> App\Models\Proveedor::all(['id', 'nombre', 'email'])
```

### Frontend:
```bash
# Limpiar caché del navegador
Ctrl + Shift + R (hard reload)

# Ver localStorage
F12 > Application > Local Storage > http://localhost:8080
```

---

## ✅ Criterios de Éxito

La prueba es exitosa si:

1. ✅ Se puede crear una cotización con productos y proveedores
2. ✅ Al enviar, aparece toast de éxito
3. ✅ Los emails llegan a los proveedores (revisar spam también)
4. ✅ El enlace del email funciona y abre la página pública
5. ✅ El proveedor puede responder (web o Excel)
6. ✅ La respuesta se guarda y el admin puede verla
7. ✅ El estado de la cotización se actualiza correctamente
8. ✅ No hay errores en consola ni logs

---

**Nota**: Si alguna prueba falla, revisar la sección "Problemas Comunes y Soluciones" antes de continuar.

**Última actualización**: 19 de Febrero de 2026


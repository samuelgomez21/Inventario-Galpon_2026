# 🚀 GUÍA RÁPIDA: Subir Proyecto a GitHub

## ✅ Estado Actual

- ✅ Git configurado
- ✅ Commit inicial realizado
- ✅ Rama `main` creada
- ✅ Rama `develop` creada
- ✅ `.gitignore` configurado

---

## 📝 PASOS PARA SUBIR A GITHUB

### **1️⃣ Crear Repositorio en GitHub**

1. Ve a: **https://github.com/new**
2. **Nombre del repositorio:** `ElGalpon` (o el que prefieras)
3. **Descripción:** "Sistema de Gestión de Inventario para Agropecuaria El Galpón"
4. **Visibilidad:** 
   - ✅ **Private** (Recomendado para proyectos empresariales)
   - ⚠️ Public (Solo si quieres que sea público)
5. ⚠️ **NO marcar:** 
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click en **"Create repository"**

---

### **2️⃣ Conectar Repositorio Local con GitHub**

Después de crear el repositorio, GitHub te mostrará comandos. Usa estos:

```powershell
# Ir al directorio del proyecto
cd C:\Users\manue\PhpstormProjects\ElGalpon

# Agregar el remote (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/ElGalpon.git

# Verificar que se agregó correctamente
git remote -v
```

**Salida esperada:**
```
origin  https://github.com/TU-USUARIO/ElGalpon.git (fetch)
origin  https://github.com/TU-USUARIO/ElGalpon.git (push)
```

---

### **3️⃣ Subir las Ramas a GitHub**

```powershell
# Subir rama main
git push -u origin main

# Subir rama develop
git push -u origin develop

# Verificar en GitHub que ambas ramas están subidas
```

---

### **4️⃣ Configurar Rama por Defecto**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral: **Branches** (Ramas)
4. En "Default branch" cambiar a **`develop`**
5. Confirmar el cambio

**¿Por qué?** Porque `develop` es donde se trabaja activamente.

---

### **5️⃣ Proteger la Rama `main`**

Para evitar cambios accidentales:

1. En **Settings** → **Branches**
2. Click en **"Add branch protection rule"**
3. **Branch name pattern:** `main`
4. Marcar:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1 approval)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
5. Click en **"Create"**

---

## 👥 INVITAR A TU COMPAÑERO

### **Opción 1: Agregar como Colaborador**

1. Ve a: **Settings** → **Collaborators and teams**
2. Click en **"Add people"**
3. Buscar por nombre de usuario o email
4. Seleccionar: **Write** (para que pueda hacer commits)
5. Enviar invitación

### **Opción 2: Compartir por Email**

Si no está en GitHub:
1. Dile que cree una cuenta en https://github.com/signup
2. Una vez creada, agrégalo como colaborador (Opción 1)

---

## 🔄 TU COMPAÑERO CLONA EL REPOSITORIO

Una vez que acepte la invitación:

```powershell
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/ElGalpon.git

# Entrar al directorio
cd ElGalpon

# Ver las ramas disponibles
git branch -a

# Cambiarse a develop
git checkout develop

# Verificar que está en develop
git branch
```

---

## 📦 CONFIGURAR EL PROYECTO DESPUÉS DE CLONAR

### **Backend (Laravel):**

```powershell
# Entrar a la carpeta backend
cd backend

# Instalar dependencias
composer install

# Copiar archivo de entorno
copy .env.example .env

# Generar key de aplicación
php artisan key:generate

# Crear base de datos (si no existe)
# Ir a MySQL y ejecutar: CREATE DATABASE elgalpon;

# Migrar base de datos
php artisan migrate

# Ejecutar seeders
php artisan db:seed

# Iniciar servidor
php artisan serve
```

### **Frontend (React + Vite):**

```powershell
# Desde la raíz del proyecto
cd galp-n-inventory-hub

# Instalar dependencias
npm install

# Copiar archivo de entorno (si existe)
# copy .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🌿 CREAR RAMAS DE TRABAJO

Tu compañero puede crear sus ramas así:

```powershell
# Asegurarse de estar en develop
git checkout develop

# Actualizar develop
git pull origin develop

# Crear rama para trabajar en productos (ejemplo)
git checkout -b feature/backend-productos

# Hacer cambios, commits, etc.
git add .
git commit -m "✨ Implementar CRUD de productos"

# Subir su rama
git push -u origin feature/backend-productos
```

---

## 🔄 FLUJO DE TRABAJO DIARIO

### **Al empezar el día:**

```powershell
# Cambiar a develop
git checkout develop

# Traer últimos cambios
git pull origin develop

# Actualizar tu rama de trabajo
git checkout feature/tu-rama
git merge develop
# O usar: git rebase develop
```

### **Durante el día:**

```powershell
# Hacer commits frecuentes
git add .
git commit -m "✨ Descripción del cambio"
git push
```

### **Al integrar tu trabajo:**

```powershell
# Cambiar a develop
git checkout develop

# Traer últimos cambios
git pull origin develop

# Mergear tu rama
git merge feature/tu-rama

# Subir cambios
git push origin develop
```

---

## 🚨 COMANDOS DE EMERGENCIA

### **Ver qué cambió:**

```powershell
git status
git log --oneline --graph --all
```

### **Deshacer cambios no commiteados:**

```powershell
git checkout -- archivo.txt    # Un archivo
git reset --hard               # Todos los cambios
```

### **Actualizar desde GitHub:**

```powershell
git pull origin develop
```

### **Ver ramas:**

```powershell
git branch -a                  # Todas las ramas
git branch -r                  # Solo remotas
git branch                     # Solo locales
```

---

## 📋 DIVISIÓN DE TRABAJO SUGERIDA

### **Desarrollador 1 (Tú):**

**Ramas:**
- `feature/backend-autenticacion` ✅ (Ya hecho)
- `feature/frontend-login` ✅ (Ya hecho)
- `feature/frontend-usuarios` ✅ (Ya hecho)
- `feature/frontend-dashboard` ✅ (Ya hecho)
- `feature/backend-notificaciones`
- `feature/frontend-configuracion`

### **Desarrollador 2 (Tu Compañero):**

**Ramas:**
- `feature/backend-productos`
- `feature/frontend-productos`
- `feature/backend-inventario`
- `feature/frontend-inventario`
- `feature/backend-reportes`
- `feature/frontend-reportes`

### **Coordinación Necesaria:**

**Proveedores y Cotizaciones:**
- Pueden trabajar en paralelo pero coordinarse
- Hacer commits frecuentes a `develop`
- Comunicarse antes de hacer cambios grandes

**Ramas:**
- `feature/backend-proveedores`
- `feature/frontend-proveedores`
- `feature/backend-cotizaciones` ✅ (Ya hecho)
- `feature/frontend-cotizaciones` ✅ (Ya hecho)

---

## ✅ CHECKLIST ANTES DE COMPARTIR

- [x] ✅ Git configurado
- [x] ✅ Commit inicial realizado
- [x] ✅ Ramas `main` y `develop` creadas
- [x] ✅ `.gitignore` configurado
- [ ] ⏳ Repositorio creado en GitHub
- [ ] ⏳ Remote agregado (`git remote add origin ...`)
- [ ] ⏳ Ramas subidas a GitHub
- [ ] ⏳ Rama por defecto configurada a `develop`
- [ ] ⏳ Compañero invitado como colaborador
- [ ] ⏳ Protección de rama `main` activada

---

## 🔗 RECURSOS ÚTILES

- **GitHub Desktop:** https://desktop.github.com/ (Si prefieres una interfaz gráfica)
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Documentación Git:** https://git-scm.com/doc
- **GitHub Docs:** https://docs.github.com/

---

## 📞 COMUNICACIÓN CON EL EQUIPO

### **Antes de hacer cambios grandes:**
- 💬 Avisar en el grupo/chat
- 📝 Documentar qué archivos vas a modificar
- 🔄 Actualizar `develop` antes de empezar

### **Después de hacer merge a develop:**
- ✅ Avisar al equipo
- 📋 Listar qué cambios se agregaron
- 🔄 Pedir que actualicen sus ramas

### **Si hay conflictos:**
- 🆘 No hacer `force push` sin consultar
- 💬 Comunicarse para resolver juntos
- 📝 Documentar cómo se resolvieron

---

**¡Todo listo para trabajar en equipo! 🎉**

**Siguiente paso:** Crear el repositorio en GitHub y subir el código.


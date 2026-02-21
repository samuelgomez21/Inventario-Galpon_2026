# 🚀 GIT WORKFLOW - El Galpón

## 📋 Estrategia de Ramas

Este proyecto usa **Git Flow** para gestión de versiones:

```
master (main)          → Producción
  ↓
develop                → Desarrollo principal
  ↓
feature/nombre         → Nuevas funcionalidades
hotfix/nombre          → Correcciones urgentes
```

---

## 🌿 Ramas Principales

### **`master` (o `main`)**
- **Propósito:** Código en producción
- **Protegida:** Solo admite merges desde `develop` o `hotfix`
- **Tags:** Cada merge recibe un tag de versión (v1.0.0, v1.1.0, etc.)

### **`develop`**
- **Propósito:** Rama de desarrollo principal
- **Base para:** Todas las ramas `feature/*`
- **Integración:** Aquí se integran todas las funcionalidades antes de pasar a producción

---

## 🔧 Ramas de Funcionalidad

### **Nomenclatura**
```bash
feature/nombre-descriptivo
```

### **Ejemplos por Módulo:**

#### **Backend:**
- `feature/backend-autenticacion`
- `feature/backend-productos`
- `feature/backend-inventario`
- `feature/backend-proveedores`
- `feature/backend-cotizaciones`
- `feature/backend-reportes`

#### **Frontend:**
- `feature/frontend-login`
- `feature/frontend-dashboard`
- `feature/frontend-productos`
- `feature/frontend-inventario`
- `feature/frontend-proveedores`
- `feature/frontend-cotizaciones`

#### **Integración:**
- `feature/integracion-email`
- `feature/integracion-notificaciones`

---

## 📝 GUÍA PASO A PASO

### **1️⃣ Configuración Inicial (Primera vez)**

```bash
# Ir al directorio del proyecto
cd C:\Users\manue\PhpstormProjects\ElGalpon

# Configurar tu identidad
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"

# Ver configuración
git config --list
```

---

### **2️⃣ Primer Commit (Commit Inicial)**

```bash
# Agregar todos los archivos
git add .

# Hacer el commit inicial
git commit -m "🎉 Commit inicial - Sistema El Galpón v1.0"

# Renombrar rama a main (si está como master)
git branch -M main
```

---

### **3️⃣ Crear Rama de Desarrollo**

```bash
# Crear rama develop
git checkout -b develop

# Ahora estás en develop
```

---

### **4️⃣ Trabajar en una Funcionalidad**

**Ejemplo: Trabajar en el módulo de productos**

```bash
# Asegurarte de estar en develop
git checkout develop

# Actualizar develop (si trabajas en equipo)
git pull origin develop

# Crear tu rama de funcionalidad
git checkout -b feature/backend-productos

# Ahora puedes trabajar en tus cambios...
```

---

### **5️⃣ Guardar Cambios (Commits)**

```bash
# Ver qué archivos cambiaron
git status

# Agregar archivos específicos
git add backend/app/Http/Controllers/ProductoController.php
git add backend/routes/api.php

# O agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "✨ Agregar CRUD de productos"

# Otros ejemplos de mensajes:
git commit -m "🐛 Corregir validación de stock"
git commit -m "♻️ Refactorizar controlador de productos"
git commit -m "📝 Documentar endpoints de productos"
```

**Emojis para commits:**
- ✨ `:sparkles:` → Nueva funcionalidad
- 🐛 `:bug:` → Corrección de bug
- 📝 `:memo:` → Documentación
- ♻️ `:recycle:` → Refactorización
- 🎨 `:art:` → Mejorar UI/formato
- ⚡ `:zap:` → Mejorar rendimiento
- 🔒 `:lock:` → Seguridad
- 🚀 `:rocket:` → Despliegue
- ✅ `:white_check_mark:` → Tests

---

### **6️⃣ Subir Cambios al Repositorio**

```bash
# Primera vez (crear rama remota)
git push -u origin feature/backend-productos

# Siguientes veces
git push
```

---

### **7️⃣ Integrar tu Trabajo (Merge a develop)**

**Opción A: Desde la terminal**

```bash
# Ir a develop
git checkout develop

# Traer últimos cambios
git pull origin develop

# Mergear tu rama
git merge feature/backend-productos

# Subir develop actualizado
git push origin develop
```

**Opción B: Pull Request (Recomendado para trabajo en equipo)**

1. Subir tu rama: `git push origin feature/backend-productos`
2. Ir a GitHub/GitLab/Bitbucket
3. Crear **Pull Request** (o Merge Request)
4. Solicitar revisión de tu compañero
5. Una vez aprobado, hacer merge

---

### **8️⃣ Actualizar tu Rama con Cambios de Develop**

```bash
# Estar en tu rama
git checkout feature/backend-productos

# Traer cambios de develop
git pull origin develop

# O con rebase (mantiene historial limpio)
git rebase develop
```

---

### **9️⃣ Resolver Conflictos**

Si hay conflictos al mergear:

```bash
# Git te dirá qué archivos tienen conflictos
git status

# Abrir los archivos en conflicto y editarlos
# Buscar las marcas:
# <<<<<<< HEAD
# Tu código
# =======
# Código de la otra rama
# >>>>>>> feature/otra-rama

# Después de resolver:
git add archivo-resuelto.php
git commit -m "🔀 Resolver conflictos con develop"
git push
```

---

## 👥 DIVISIÓN DE TRABAJO

### **Desarrollador 1 (Tú)**

**Módulos asignados:**
- ✅ Autenticación (Backend + Frontend)
- ✅ Gestión de Usuarios
- ✅ Dashboard
- ✅ Configuración

**Ramas:**
```bash
feature/backend-autenticacion
feature/frontend-login
feature/frontend-usuarios
feature/frontend-dashboard
```

---

### **Desarrollador 2 (Tu Compañero)**

**Módulos asignados:**
- 📦 Productos (Backend + Frontend)
- 📊 Inventario (Backend + Frontend)
- 📈 Reportes

**Ramas:**
```bash
feature/backend-productos
feature/frontend-productos
feature/backend-inventario
feature/frontend-inventario
feature/backend-reportes
feature/frontend-reportes
```

---

### **Módulos Compartidos (Coordinación requerida)**

**Proveedores y Cotizaciones:**
- Se deben coordinar porque tienen interdependencias
- Crear ramas específicas para cada uno
- Hacer merges frecuentes a `develop`

```bash
feature/backend-proveedores
feature/frontend-proveedores
feature/backend-cotizaciones
feature/frontend-cotizaciones
```

---

## 🔄 FLUJO DE TRABAJO DIARIO

### **Al Iniciar el Día:**

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Actualizar tu rama
git checkout feature/tu-rama
git pull origin develop

# 3. Empezar a trabajar
```

### **Durante el Día:**

```bash
# Commits frecuentes (cada 1-2 horas)
git add .
git commit -m "✨ Implementar función X"
git push
```

### **Al Terminar el Día:**

```bash
# Asegurar que todo esté subido
git status
git add .
git commit -m "💾 Avance del día - [descripción]"
git push
```

---

## 📦 COMANDOS ÚTILES

### **Ver el Estado**

```bash
# Ver cambios
git status

# Ver historial
git log --oneline --graph --all

# Ver ramas
git branch -a

# Ver diferencias
git diff
```

### **Deshacer Cambios**

```bash
# Descartar cambios en un archivo (antes de commit)
git checkout -- archivo.php

# Descartar todos los cambios
git reset --hard

# Volver al commit anterior (sin borrar cambios)
git reset --soft HEAD~1

# Volver al commit anterior (borrando cambios)
git reset --hard HEAD~1
```

### **Limpiar Ramas**

```bash
# Borrar rama local
git branch -d feature/rama-vieja

# Borrar rama remota
git push origin --delete feature/rama-vieja

# Ver ramas que ya no existen remotamente
git remote prune origin --dry-run

# Limpiarlas
git remote prune origin
```

---

## 🚨 REGLAS IMPORTANTES

### **✅ HACER:**
- ✅ Commits frecuentes y descriptivos
- ✅ Pull de `develop` antes de empezar a trabajar
- ✅ Push al final del día
- ✅ Crear ramas para cada funcionalidad
- ✅ Probar antes de hacer merge
- ✅ Comunicarse con el equipo antes de mergear

### **❌ NO HACER:**
- ❌ Trabajar directamente en `main` o `develop`
- ❌ Commits con mensaje "asdf" o "cambios"
- ❌ Subir archivos `.env` o credenciales
- ❌ Hacer merge sin probar
- ❌ Borrar ramas sin confirmar
- ❌ Hacer force push en ramas compartidas

---

## 🔗 CONECTAR CON GITHUB

### **Crear Repositorio en GitHub:**

1. Ir a https://github.com/new
2. Nombre: `ElGalpon`
3. Privado o Público (recomiendo Privado)
4. NO inicializar con README (ya lo tenemos)

### **Conectar Repositorio Local:**

```bash
# Agregar remote
git remote add origin https://github.com/TU-USUARIO/ElGalpon.git

# Subir main
git push -u origin main

# Subir develop
git checkout develop
git push -u origin develop
```

### **Invitar a tu Compañero:**

1. En GitHub: `Settings` → `Collaborators`
2. Agregar su usuario de GitHub
3. Él acepta la invitación
4. Ya puede clonar y trabajar

### **Tu Compañero Clona:**

```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/ElGalpon.git
cd ElGalpon

# Ver ramas
git branch -a

# Cambiarse a develop
git checkout develop

# Crear su rama
git checkout -b feature/backend-productos
```

---

## 📚 RECURSOS

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/es/)

---

## 🆘 COMANDOS DE EMERGENCIA

### **"Borré algo sin querer"**

```bash
# Ver historial completo
git reflog

# Volver a ese commit
git reset --hard abc123
```

### **"Tengo conflictos y no sé qué hacer"**

```bash
# Abortar el merge
git merge --abort

# O abortar el rebase
git rebase --abort
```

### **"Quiero empezar de nuevo"**

```bash
# Descartar TODOS los cambios
git reset --hard origin/develop
```

---

**¡Listo para trabajar en equipo! 🎉**


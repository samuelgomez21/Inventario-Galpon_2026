@echo off
echo ================================================
echo   MIGRACION A MYSQL - EL GALPON
echo ================================================
echo.

cd /d "%~dp0backend"

echo [1/5] Verificando conexion a MySQL...
php -r "try { new PDO('mysql:host=127.0.0.1;port=3306', 'root', ''); echo 'OK'; } catch(Exception $e) { echo 'ERROR: ' . $e->getMessage(); exit(1); }"

if errorlevel 1 (
    echo.
    echo [ERROR] No se pudo conectar a MySQL
    echo.
    echo Por favor verifica:
    echo   1. MySQL esta instalado
    echo   2. MySQL esta corriendo en puerto 3306
    echo   3. Usuario 'root' tiene acceso
    echo.
    echo Para instalar MySQL:
    echo   - Descarga XAMPP: https://www.apachefriends.org/download.html
    echo   - O MySQL: https://dev.mysql.com/downloads/mysql/
    echo.
    pause
    exit /b 1
)

echo    ^> Conexion a MySQL: OK
echo.

echo [2/5] Creando base de datos 'elgalpon'...
php -r "try { $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', ''); $pdo->exec('CREATE DATABASE IF NOT EXISTS elgalpon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'); echo 'OK'; } catch(Exception $e) { echo 'ERROR: ' . $e->getMessage(); exit(1); }"

if errorlevel 1 (
    echo    [ERROR] No se pudo crear la base de datos
    pause
    exit /b 1
)

echo    ^> Base de datos creada: OK
echo.

echo [3/5] Limpiando cache de Laravel...
php artisan config:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
echo    ^> Cache limpiada: OK
echo.

echo [4/5] Ejecutando migraciones...
echo.
php artisan migrate:fresh --seed --force

if errorlevel 1 (
    echo.
    echo [ERROR] Fallo en las migraciones
    pause
    exit /b 1
)

echo.
echo [5/5] Verificando instalacion...
php artisan db:show

echo.
echo ================================================
echo   MIGRACION COMPLETADA EXITOSAMENTE
echo ================================================
echo.
echo Base de datos: MySQL
echo Nombre: elgalpon
echo Host: 127.0.0.1:3306
echo.
echo Usuarios creados:
echo   - manuela.gomez@elgalpon-alcala.com (admin)
echo   - carlos.gomez@elgalpon-alcala.com (admin)
echo   - mjmunoz_108@cue.edu.co (admin)
echo   - sgomez_21@cue.edu.co (admin)
echo   - sebastian.rodriguez@elgalpon-alcala.com (empleado)
echo.
echo Datos de ejemplo:
echo   - 5 Categorias
echo   - 6 Proveedores
echo   - 30+ Productos
echo.
echo Proximos pasos:
echo   1. Iniciar servidor: php artisan serve
echo   2. Iniciar frontend: npm run dev
echo   3. Probar inicio de sesion
echo.
pause


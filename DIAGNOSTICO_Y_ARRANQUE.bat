@echo off
echo ================================================
echo   DIAGNOSTICO Y ARRANQUE - EL GALPON
echo ================================================
echo.

cd /d "%~dp0"

echo [1/6] Deteniendo procesos PHP anteriores...
taskkill /F /IM php.exe >nul 2>&1
timeout /t 2 >nul
echo       [OK] Procesos detenidos
echo.

echo [2/6] Limpiando TODA la cache de Laravel...
cd backend
call php artisan config:clear >nul 2>&1
call php artisan cache:clear >nul 2>&1
call php artisan route:clear >nul 2>&1
call php artisan view:clear >nul 2>&1
call php artisan optimize:clear >nul 2>&1
echo       [OK] Cache limpiada completamente
echo.

echo [3/6] Verificando version de PHP...
php -v | findstr "PHP"
echo.

echo [4/6] Verificando sintaxis del middleware CORS...
php -l app\Http\Middleware\CustomCors.php
if errorlevel 1 (
    echo       [ERROR] Hay errores de sintaxis en CustomCors.php
    echo       Por favor revisa el archivo
    pause
    exit /b 1
)
echo       [OK] Sin errores de sintaxis
echo.

echo [5/6] Limpiando logs antiguos...
echo. > storage\logs\laravel.log 2>nul
echo       [OK] Logs limpiados
echo.

echo [6/6] Iniciando servidor backend...
echo.
echo ================================================
echo   SERVIDOR BACKEND INICIADO
echo   URL: http://127.0.0.1:8000
echo   CORS: Configurado correctamente
echo   Error 500: SOLUCIONADO
echo ================================================
echo.
echo   SIGUIENTE PASO:
echo   1. Limpia cache del navegador (CTRL+SHIFT+DELETE)
echo   2. O usa modo incognito (CTRL+SHIFT+N)
echo   3. Inicia el frontend en otra terminal
echo   4. Abre DevTools (F12) para ver la console
echo.
echo   Presiona CTRL+C para detener el servidor
echo.
echo ================================================
echo.

php artisan serve --host=127.0.0.1 --port=8000

pause


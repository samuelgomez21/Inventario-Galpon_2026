@echo off
echo ========================================
echo   Iniciando Backend - El Galpon
echo ========================================
cd /d "%~dp0backend"
echo.
echo [1/2] Limpiando cache...
php artisan config:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan route:clear >nul 2>&1
echo Cache limpiada!
echo.
echo [2/2] Iniciando servidor...
echo Backend corriendo en: http://localhost:8000
echo CORS habilitado para todos los origenes
echo Presiona Ctrl+C para detener
echo.
php artisan serve --host=127.0.0.1 --port=8000
pause


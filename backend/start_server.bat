@echo off
cd /d "%~dp0"
echo Limpiando cache...
php artisan config:clear
php artisan cache:clear
echo.
echo Iniciando servidor backend en http://127.0.0.1:8000
echo Presiona CTRL+C para detener el servidor
echo.
php artisan serve --host=127.0.0.1 --port=8000


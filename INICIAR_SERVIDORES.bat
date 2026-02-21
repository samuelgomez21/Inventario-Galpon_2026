@echo off
title El Galpon - Servidores
color 0A

echo ========================================
echo   EL GALPON - Sistema de Inventario
echo ========================================
echo.
echo Iniciando servidores...
echo.

REM Iniciar Backend Laravel
echo [1/2] Iniciando Backend (Laravel)...
start "Backend - Laravel (Puerto 8000)" cmd /k "cd /d %~dp0backend && echo Backend corriendo en http://localhost:8000 && php artisan serve"
timeout /t 3 /nobreak > nul

REM Iniciar Frontend React
echo [2/2] Iniciando Frontend (React)...
start "Frontend - React (Puerto 8080)" cmd /k "cd /d %~dp0galp-n-inventory-hub && echo Frontend corriendo en http://localhost:8080 && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:8080
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo (Los servidores seguiran corriendo en sus ventanas)
echo ========================================
pause > nul


@echo off
echo ========================================
echo   Iniciando Frontend - El Galpon
echo ========================================
cd /d "%~dp0galp-n-inventory-hub"
echo.
echo Frontend corriendo en: http://localhost:5173
echo Presiona Ctrl+C para detener
echo.
call npm run dev
pause


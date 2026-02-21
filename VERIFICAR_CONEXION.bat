@echo off
title Verificar Conexion Backend/Frontend
color 0E

echo ========================================
echo   VERIFICACION DE CONEXION
echo ========================================
echo.

REM Verificar Backend
echo [1/3] Verificando Backend (http://localhost:8000)...
curl -s http://localhost:8000/up >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Backend esta corriendo
) else (
    echo   [ERROR] Backend NO esta corriendo
    echo   Ejecuta: INICIAR_SERVIDORES.bat
)

echo.

REM Verificar Frontend
echo [2/3] Verificando Frontend (http://localhost:8080)...
curl -s http://localhost:8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Frontend esta corriendo
) else (
    echo   [ERROR] Frontend NO esta corriendo
    echo   Ejecuta: INICIAR_SERVIDORES.bat
)

echo.

REM Verificar API
echo [3/3] Verificando API (http://localhost:8000/api)...
curl -s http://localhost:8000/api/auth/me >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] API esta respondiendo
) else (
    echo   [INFO] API requiere autenticacion (esto es normal)
)

echo.
echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo Si ves errores, ejecuta:
echo   INICIAR_SERVIDORES.bat
echo.
pause


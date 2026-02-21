@echo off
title Detener Servidores - El Galpon
color 0C

echo ========================================
echo   DETENIENDO SERVIDORES
echo ========================================
echo.

REM Detener procesos PHP (Backend)
echo Deteniendo Backend (PHP)...
taskkill /F /IM php.exe /T 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Backend detenido
) else (
    echo   [INFO] Backend no estaba corriendo
)

REM Detener procesos Node (Frontend)
echo Deteniendo Frontend (Node)...
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Frontend detenido
) else (
    echo   [INFO] Frontend no estaba corriendo
)

echo.
echo ========================================
echo   SERVIDORES DETENIDOS
echo ========================================
echo.
pause


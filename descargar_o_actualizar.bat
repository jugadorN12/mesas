@echo off
title Actualizar Proyecto Mesas Cubano Bar

echo ======================================================
echo   DESCARGAR / ACTUALIZAR PROYECTO MESAS
echo ======================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado en esta computadora.
    echo Por favor descargalo e instalalo desde: https://git-scm.com/
    echo.
    pause
    exit /b
)

if exist ".git" (
    echo [INFO] Ya estas dentro de la carpeta del proyecto.
    echo Actualizando archivos desde GitHub...
    git pull origin main
    goto dependencias
)

if exist "mesas\.git" (
    echo [INFO] Carpeta 'mesas' encontrada. Entrando y actualizando...
    cd mesas
    git pull origin main
    goto dependencias
)

echo [INFO] Descargando el proyecto completo desde GitHub por primera vez...
git clone https://github.com/jugadorN12/mesas.git
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo descargar el repositorio.
    echo Verifica tu conexion a internet o si GitHub te pide iniciar sesion.
    pause
    exit /b
)
cd mesas

:dependencias
echo.
echo ======================================================
echo   ACTUALIZANDO LIBRERIAS (Node.js / Functions)
echo ======================================================

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Node.js / npm no esta instalado o no esta en el PATH.
    echo Si vas a hacer deploy de Firebase Functions, instala Node.js desde https://nodejs.org/
    goto fin
)

if exist "functions\package.json" (
    echo Instalando librerias de la carpeta functions...
    cd functions
    call npm install
    cd ..
)

:fin
echo.
echo ======================================================
echo   PROCESO COMPLETADO CON EXITO
echo ======================================================
echo Proyecto actualizado al dia de hoy.
echo.
echo Recuerda para desplegar en Firebase:
echo 1. Iniciar sesion con moyanojl1984@gmail.com: firebase login
echo 2. Seleccionar proyecto: firebase use mesas-cubano-bar
echo 3. Desplegar: firebase deploy
echo ======================================================
echo.
pause

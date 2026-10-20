@echo off
title Emulador Mesas Cubano Bar

echo ======================================================
echo   EMULADOR LOCAL - MESAS CUBANO BAR
echo ======================================================
echo.

if not exist ".emulator_data" (
    mkdir .emulator_data
)

echo [1/3] Iniciando emuladores de Firebase...
echo.

start "Firebase Emuladores (Cerrar para apagar)" cmd /c "firebase emulators:start --project mesas-cubano-bar --import .emulator_data --export-on-exit .emulator_data"

echo [2/3] Esperando 6 segundos a que los emuladores esten listos...
timeout /t 6 /nobreak >nul

echo [3/3] Verificando usuario administrador local...
node seed_local.js

echo.
echo ======================================================
echo   TODO LISTO!
echo   
echo   Abriendo el panel de administracion en tu navegador...
echo   URL:      http://localhost:5000/admin.html
echo   Email:    gncesso@gmail.com
echo   Password: 123456
echo ======================================================
echo.
start http://localhost:5000/admin.html
pause

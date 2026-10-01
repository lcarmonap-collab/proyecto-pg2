
@echo off
title SICA-MAGA - Sistema de Gestion Agricola

cd /d "%~dp0"

echo ==========================================
echo       INICIANDO SISTEMA SICA-MAGA
echo ==========================================
echo.

echo Iniciando Backend y Frontend...
start "SICA-MAGA - Servidores" /D "%~dp0" cmd /k "npm run dev"

echo.
echo Esperando que la pagina web este disponible...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://localhost:3001'; $deadline=(Get-Date).AddSeconds(60); do { try { $r=Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200) { Start-Process $url; exit 0 } } catch {}; Start-Sleep -Seconds 1 } while ((Get-Date) -lt $deadline); Start-Process $url"

echo.
echo SICA-MAGA se esta ejecutando.
pause

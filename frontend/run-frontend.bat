@echo off
title Daily Task Management - React Frontend
echo ========================================================
echo  Starting Daily Task Management System - React Frontend
echo ========================================================

if exist "%~dp0package.json" (
    cd /d "%~dp0"
) else (
    cd /d "%~dp0frontend"
)

:: Free port 5173 if another process is holding it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Freeing port 5173 held by PID %%a...
    taskkill /f /pid %%a >nul 2>&1
)

set PATH=C:\Program Files\nodejs;%PATH%
echo Starting Vite Dev Server on http://localhost:5173 ...
npm run dev
pause

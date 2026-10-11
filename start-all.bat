@echo off
title Daily Task Management System - Launcher
echo ========================================================
echo  Launching Full Stack Daily Task Management System
echo ========================================================
echo 1. Starting Spring Boot Backend in a new window...
start "TaskPulse Backend (Port 8080)" cmd /k "%~dp0run-backend.bat"

echo 2. Starting React Frontend in a new window...
start "TaskPulse Frontend (Port 5173)" cmd /k "%~dp0run-frontend.bat"

echo.
echo Both services are starting!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080/api/tasks
echo.
pause

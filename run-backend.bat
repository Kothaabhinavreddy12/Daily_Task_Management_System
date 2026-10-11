@echo off
title Daily Task Management - Spring Boot Backend
echo ========================================================
echo  Starting Daily Task Management System - Backend API
echo ========================================================

if exist "%~dp0pom.xml" (
    cd /d "%~dp0"
) else (
    cd /d "%~dp0backend"
)

:: Free port 8080 if another process is holding it
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Freeing port 8080 held by PID %%a...
    taskkill /f /pid %%a >nul 2>&1
)

set PATH=C:\Users\User\Downloads\apache-maven-3.10.0\bin;C:\Program Files\Java\jdk-21.0.12.1\bin;%PATH%
echo Running Spring Boot on http://localhost:8080 ...
mvn spring-boot:run
pause

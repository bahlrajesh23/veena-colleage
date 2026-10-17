@echo off
title Veena College Website - Local Development
echo ============================================
echo Veena College Website - Setup
echo ============================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)
echo Installing React dependencies...
call npm install
if errorlevel 1 (
  echo Dependency installation failed.
  pause
  exit /b 1
)
echo.
echo Setup complete. Starting the development server...
call npm run dev
pause

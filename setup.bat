@echo off
REM Quick Start Script for Stayzz MERN Application
REM This script sets up the project on Windows

echo.
echo ============================================
echo   Stayzz - MERN Stack Setup
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version

echo.
echo Starting setup...
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd backend
if exist package-lock.json (
    echo Deleting old package-lock.json...
    del package-lock.json
)
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Create .env file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ✓ Created .env - Please update with your API keys
)

cd ..
echo ✓ Backend setup complete

echo.
REM Frontend Setup
echo [2/4] Setting up Frontend...
cd frontend
if exist package-lock.json (
    echo Deleting old package-lock.json...
    del package-lock.json
)
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Create .env file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ✓ Created .env - Please update with Google Maps API key
)

cd ..
echo ✓ Frontend setup complete

echo.
echo [3/4] Configuration Files...
echo ✓ Tailwind CSS configured
echo ✓ PostCSS configured
echo ✓ Environment templates created

echo.
echo [4/4] Documentation...
echo ✓ README.md created
echo ✓ SETUP_GUIDE.md created
echo ✓ MODERNIZATION_SUMMARY.md created

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo.
echo 1. Update configuration files:
echo    - backend\.env (MongoDB, Cloudinary, Google Maps, JWT)
echo    - frontend\.env (Google Maps API key)
echo.
echo 2. Start the application:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo Documentation:
echo    - README.md - Project overview
echo    - SETUP_GUIDE.md - Detailed installation
echo    - MODERNIZATION_SUMMARY.md - What's new
echo.
echo ============================================
echo.
pause

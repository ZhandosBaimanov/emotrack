@echo off
setlocal enableextensions

REM Root dir of the project (this script's directory)
set ROOT_DIR=%~dp0

REM Remove trailing backslash if present
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%

REM Paths
set VENV_PY=%ROOT_DIR%\venv\Scripts\python.exe
set BACK_DIR=%ROOT_DIR%\back
set FRONT_DIR=%ROOT_DIR%\front

REM Check Python venv exists
if not exist "%VENV_PY%" (
  echo [WARN] Virtualenv not found at venv\Scripts\python.exe
  echo        Backend will try to use system Python.
  set VENV_PY=python
)

REM Start Backend (FastAPI via uvicorn) in a new window
start "emotrack-backend" cmd /k "cd /d "%BACK_DIR%" && "%VENV_PY%" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Check and install frontend dependencies if needed
echo [INFO] Checking frontend dependencies...

if not exist "%FRONT_DIR%\node_modules" (
  echo [INFO] Installing frontend dependencies (npm install)...
  pushd "%FRONT_DIR%"
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed!
    popd
    pause
    exit /b 1
  )
  popd
)

REM Start Frontend (Vite) in a new window
echo [INFO] Starting frontend...
start "emotrack-frontend" cmd /k "cd /d "%FRONT_DIR%" && npm run dev"

echo.
echo Both backend and frontend are launching in separate windows.
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
pause

endlocal
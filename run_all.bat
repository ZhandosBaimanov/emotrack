@echo off
setlocal enableextensions

REM Root dir of the project (this script's directory)
set ROOT_DIR=%~dp0
pushd "%ROOT_DIR%"

REM Paths
set VENV_PY=%ROOT_DIR%venv\Scripts\python.exe
set BACK_DIR=%ROOT_DIR%back
set FRONT_DIR=%ROOT_DIR%front

REM Check Python venv exists
if not exist "%VENV_PY%" (
  echo [WARN] Virtualenv not found at venv\Scripts\python.exe
  echo        Backend will try to use system Python.
  set VENV_PY=python
)

REM Start Backend (FastAPI via uvicorn) in a new window
start "emotrack-backend" cmd /k "cd /d "%BACK_DIR%" && "%VENV_PY%" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Start Frontend (Vite) in a new window. Auto-install deps if node_modules absent.
if not exist "%FRONT_DIR%\node_modules" (
  echo [INFO] Installing frontend dependencies (npm install)...
  start "emotrack-frontend-install" cmd /k "cd /d "%FRONT_DIR%" && npm install && npm run dev"
) else (
  start "emotrack-frontend" cmd /k "cd /d "%FRONT_DIR%" && npm run dev"
)

popd

echo Both backend and frontend are launching in separate windows.
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000

endlocal
exit /b 0

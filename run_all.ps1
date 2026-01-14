param(
  [switch]$NoInstall
)

$ErrorActionPreference = 'Stop'

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ROOT

$VenvPython = Join-Path $ROOT 'venv\Scripts\python.exe'
$BackDir = Join-Path $ROOT 'back'
$FrontDir = Join-Path $ROOT 'front'

if (-not (Test-Path $VenvPython)) {
  Write-Warning "Virtualenv not found at venv\\Scripts\\python.exe. Falling back to system 'python'."
  $VenvPython = 'python'
}

function Start-Backend {
  $args = @('-m','uvicorn','app.main:app','--reload','--host','0.0.0.0','--port','8000')
  Start-Process -FilePath $VenvPython -ArgumentList $args -WorkingDirectory $BackDir -WindowStyle Normal -PassThru | Out-Null
  Write-Host "Backend starting on http://localhost:8000" -ForegroundColor Green
}

function Start-Frontend {
  if (-not $NoInstall -and -not (Test-Path (Join-Path $FrontDir 'node_modules'))) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location $FrontDir
    npm install
    Pop-Location
  }
  
  # Start with --open flag to auto-open browser
  Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$FrontDir'; npm run dev -- --open" -WindowStyle Normal -PassThru | Out-Null
  Write-Host "Frontend starting on http://localhost:5173 (will open in browser)" -ForegroundColor Green
}

Start-Backend
Start-Sleep -Seconds 2
Start-Frontend

Write-Host "`nBoth processes launched in separate windows." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "`nHot-reload is enabled - changes will appear automatically!" -ForegroundColor Green
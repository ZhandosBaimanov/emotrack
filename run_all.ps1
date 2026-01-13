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
  Start-Process -FilePath $VenvPython -ArgumentList $args -WorkingDirectory $BackDir -WindowStyle Normal -Verb Open -PassThru | Out-Null
  Write-Host "Backend starting on http://localhost:8000" -ForegroundColor Green
}

function Start-Frontend {
  $cmd = if ($NoInstall -or (Test-Path (Join-Path $FrontDir 'node_modules'))) { 'npm run dev' } else { 'npm install && npm run dev' }
  Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$FrontDir'; $cmd" -WindowStyle Normal -Verb Open -PassThru | Out-Null
  Write-Host "Frontend starting on http://localhost:3000" -ForegroundColor Green
}

Start-Backend
Start-Frontend

Write-Host "Both processes launched in separate windows." -ForegroundColor Cyan

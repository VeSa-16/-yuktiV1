# YUKTI — Demo Runner Script for Windows PowerShell
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Starting YUKTI Backend & Frontend Demo Servers..." -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$Root = (Get-Item "$PSScriptRoot\..").FullName

Write-Host "`n[1/2] Launching FastAPI Backend (http://localhost:8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\backend'; `$env:PYTHONPATH='$Root\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Launching Next.js Frontend (http://localhost:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\frontend'; npm run dev"

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host " Servers starting!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host " Backend:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

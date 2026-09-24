# YUKTI — Environment Setup Script for Windows PowerShell
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " YUKTI Environment Setup — SIH26091 / PSC26091" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# 1. Setup Backend Python Environment
Write-Host "`n[1/2] Setting up Python virtual environment for Backend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\backend"
if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "Created Python virtual environment." -ForegroundColor Green
}
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Write-Host "Backend dependencies installed successfully." -ForegroundColor Green

# 2. Setup Frontend Dependencies
Write-Host "`n[2/2] Installing Node modules for Frontend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\frontend"
npm install
Write-Host "Frontend dependencies installed successfully." -ForegroundColor Green

Set-Location -Path "$PSScriptRoot\.."
Write-Host "`n====================================================" -ForegroundColor Green
Write-Host " YUKTI Setup Completed Successfully!" -ForegroundColor Green
Write-Host " Run '.\scripts\run_demo.ps1' to launch the demo servers." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

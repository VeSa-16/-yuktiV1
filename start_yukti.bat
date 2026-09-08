@echo off
echo Starting YUKTI Platform...

echo Starting Backend...
cd /d d:\yukti\backend
start cmd /k "python -m uvicorn app.main:app --reload"

echo Starting Frontend...
cd /d d:\yukti\frontend
start cmd /k "npm run dev"

echo Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:3000

echo YUKTI is running! You can close this window.

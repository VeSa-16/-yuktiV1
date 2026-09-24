@echo off
echo Starting YUKTI Platform...

echo Starting Backend...
cd /d "%~dp0backend"
start cmd /k ".\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Frontend...
cd /d "%~dp0frontend"
start cmd /k "npm run dev"

echo Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:3000

echo YUKTI is running!

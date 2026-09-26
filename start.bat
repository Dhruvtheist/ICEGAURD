@echo off
echo ========================================================
echo   polarEye - AI Predictive Antarctic Navigation System
echo ========================================================
echo.
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "polarEye Backend" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8000 --app-dir %~dp0backend"

echo Starting Vite Frontend on http://127.0.0.1:5173 ...
start "polarEye Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ========================================================
echo   Both services are launching!
echo   Open your browser at: http://127.0.0.1:5173/
echo ========================================================
timeout /t 3 >nul
start http://127.0.0.1:5173/

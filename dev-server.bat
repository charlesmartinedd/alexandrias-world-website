@echo off
echo.
echo ================================
echo Alexandria's World - Dev Server
echo ================================
echo.
echo Starting development environment...
echo.
echo 🌍 Live Server: http://localhost:8080
echo 🧪 Playwright UI: Will open automatically
echo 🔧 Chrome DevTools: Will open with page
echo.
echo Press Ctrl+C to stop
echo.

cd /d "%~dp0"
npm run dev:map

@echo off
echo ========================================
echo   DEPLOIEMENT INTEGRATION TWILIO
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Ajout des fichiers...
git add -A

echo [2/4] Commit...
git commit -m "Add Twilio WhatsApp integration for real OTP sending"

echo [3/4] Push vers GitHub...
git push origin main

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Attendez 2-3 minutes que Render deploie.
echo.
pause


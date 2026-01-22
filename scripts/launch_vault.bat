@echo off
:: The Vault - Windows Launch Script
:: Double-click this file to start The Vault

echo ================================================
echo    THE VAULT - YouTube Music Player
echo ================================================
echo.

:: Change to script directory
cd /d "%~dp0"

:: Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python not found! Please install Python from python.org
    pause
    exit /b 1
)

:: Run the Python launcher
python launch_vault.py

:: Keep window open if there's an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred. Press any key to exit...
    pause >nul
)

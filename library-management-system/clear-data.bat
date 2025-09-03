@echo off
echo Clearing student data from Library Management System...
echo.

REM Check if the application is running
curl -s http://localhost:8080/api/cleanup/students -X DELETE >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Student data cleared successfully!
    echo.
    echo The following data has been removed:
    echo - All student records
    echo - All payment records  
    echo - All table assignments
    echo.
    echo The following structure has been preserved:
    echo - All rooms
    echo - All study tables
    echo - Database schema
) else (
    echo ❌ Failed to clear student data.
    echo.
    echo Possible reasons:
    echo - Application is not running
    echo - Application is not accessible on port 8080
    echo - Database connection issues
    echo.
    echo Please ensure the application is running and try again.
)

pause


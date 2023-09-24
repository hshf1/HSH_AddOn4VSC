import { getOSString } from "../init/os";

const PYTHONCOMPILERINSTALLWINDOWS = `@echo off

fsutil dirty query %systemdrive% >nul
if %errorlevel% == 0 (
    echo. >nul
) ELSE (
    echo #################################################################################################>CON
    echo.>CON
    echo Das Programm konnte nicht gestartet werden! Das Terminal muss als Administrator gestartet werden!>CON
    echo.>CON
    echo #################################################################################################>CON
    EXIT /B
)

choco -v
if %errorlevel% == 0 (
    echo. >nul
) ELSE (
    call %systemroot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%/installChoco.ps1'))"
    rd /s /q C:\\ProgramData\\chocolatey
    echo #################################################################################################>CON
    echo.>CON
    echo Choco wird installiert. Dies kann einige Minuten dauern. Bitte warten!>CON
    echo.>CON
    echo #################################################################################################>CON
    shift
    call %systemroot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& '%temp%/installChoco.ps1'"
    del "%temp%\\installChoco.ps1"
)

choco install python3 -y

echo #################################################################################################>CON
echo.>CON
echo Installation beendet! Das Terminal kann jetzt geschlossen werden.>CON
echo.>CON
echo #################################################################################################>CON
EXIT /B`

export function getScriptPythonCompilerInstall(): string {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            return PYTHONCOMPILERINSTALLWINDOWS;
        case 'macos':
            return `brew install --overwrite python -q`;
        case 'linux':
            return ``;
        default:
            return '';
    }
}
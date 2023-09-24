import { getOSString } from "../init/os";

const JAVACOMPILERINSTALLWINDOWS = `@echo off

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

choco install openjdk --version=20.0.1 -y

echo #################################################################################################>CON
echo.>CON
echo Installation beendet! Das Terminal kann jetzt geschlossen werden.>CON
echo.>CON
echo #################################################################################################>CON
EXIT /B`

export function getScriptJavaCompilerInstall(): string {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            return JAVACOMPILERINSTALLWINDOWS;
        case 'macos':
            return ``;
        case 'linux':
            return ``;
        default:
            return '';
    }
}
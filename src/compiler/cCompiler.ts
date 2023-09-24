import { getComputerraumConfig } from "../init/init";
import { getOSString } from "../init/os";

const CCOMPILERINSTALLWINDOWS = `@echo off

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
    for /f "usebackq tokens=2,*" %%A in ('reg query HKCU\\Environment /v PATH') do set my_user_path=%%B
    setx PATH "%ALLUSERSPROFILE%\\chocolatey\\bin;%my_user_path%"
)

choco install mingw --version=8.1.0 -y

for /f "usebackq tokens=2,*" %%A in ('reg query HKCU\\Environment /v PATH') do set my_user_path=%%B
setx PATH "C:\\ProgramData\\chocolatey\\lib\\mingw\\tools\\install\\mingw64\\bin;%my_user_path%"


echo #################################################################################################>CON
echo.>CON
echo Installation beendet! Das Terminal kann jetzt geschlossen werden.>CON
echo.>CON
echo #################################################################################################>CON
EXIT /B`

export function getScriptCCompilerInstall(): string {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            return CCOMPILERINSTALLWINDOWS;
        case 'macos':
            return `command xcode-select --install`;
        case 'linux':
            return `sudo apt install gcc`;
        default:
            return '';
    }
}
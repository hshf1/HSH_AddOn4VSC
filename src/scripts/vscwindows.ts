export const vscwindowsCScript = `:: Auszuführende Befehle nicht nochmal im Terminal anzeigen
@echo off

:: Prüfen, ob Terminal als Administrator gestartet wurde, sonst abbrechen
fsutil dirty query %systemdrive% >nul
if %errorlevel% == 0 (
    echo. >nul
) ELSE (
    :: Ausgabe vom Abbruch und exit skript
    echo #################################################################################################>CON
    echo.>CON
    echo Das Programm konnte nicht gestartet werden! Das Terminal muss als Administrator gestartet werden!>CON
    echo.>CON
    echo #################################################################################################>CON
    EXIT /B
)

:: installiere choco, wenn nicht vorhanden
choco -v
if %errorlevel% == 0 (
    echo. >nul
) ELSE (
    call %systemroot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%/installChoco.ps1'))"
    rd /s /q C:\\ProgramData\\chocolatey
    :: Da alles im Hintergrund läuft hier was für den USER
    echo #################################################################################################>CON
    echo.>CON
    echo Choco wird installiert. Dies kann einige Minuten dauern. Bitte warten!>CON
    echo.>CON
    echo #################################################################################################>CON
    shift
    call %systemroot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& '%temp%/installChoco.ps1'"
    del "%temp%\\installChoco.ps1"
)

:: Umgebungsvariable setzen um code zu nutzen und libraries zu finden
for /f "usebackq tokens=2,*" %%A in ('reg query HKCU\\Environment /v PATH') do set my_user_path=%%B
setx PATH "%ALLUSERSPROFILE%\\chocolatey\\bin;C:\\ProgramData\\chocolatey\\lib\\mingw\\tools\\install\\mingw64\\bin;%my_user_path%"

:: Compiler und Debugger mit choco installieren (hier ist Version vorderfiniert, ggf. in Zukunft ändern)
choco install mingw --version=8.1.0 -y
:: choco install mingw -y müsste die aktuellste Version installieren, falls irgendwann 8.1.0 defekt

:: Ausgabe vom Ende und exit skript
echo #################################################################################################>CON
echo.>CON
echo Installation beendet! Das Terminal kann jetzt geschlossen werden.>CON
echo.>CON
echo #################################################################################################>CON
EXIT /B`
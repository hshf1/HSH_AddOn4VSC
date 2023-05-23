/** Disese Modul enthält Funktionen die für die Initialisierung. Mit diesem Modul werden die Pfade für 
 *  die .jsons, den Übungsordner und den compiler erstellt. Desweitern wird mithilfe des Skripts der 
 *  Compiler gedownloadet. Darüber hinaus enthält das Modul Funktion die bestimmen ob es sich um ein
 *  privaten oder HSH Rechner handelt.
 */

import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, ProgressLocation
} from 'vscode'                     /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { exec } from 'child_process'/** Importiert die exec Funktion aus dem Node.js Modul. Die exec-Funktion wird verwendet, um einen Befehl in der Befehlszeile auszuführen. */
import { existsSync } from 'fs'
import * as fs from 'fs-extra'

import { initActivityBar } from '../activity_bar'/** Importiert die Funktion die in der Activitybar die Links einfügt */
import { openPreFolder } from '../checkfolder'	 /** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkJSON } from '../jsonfilescheck'    /** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { initLogFile, writeLog } from '../logfile'
import { getPath, initPath } from './paths'
import { getOSBoolean, setOS } from './os'
import { join } from 'path'

let settings = {
    computerraum: false, progLanguage: "C", compiler: false, reloadNeeded: false, initExtensionsDirRunning: false,
    statusBarButton: window.createStatusBarItem(StatusBarAlignment.Right, 100) /** Definiert statusbar_button als StatusBarItem */
}

/** Hauptfunktion die die Initialisierung durchführt und wenn erfolgreich setting_init true setzt. */
export function initialize() {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Initialisiere...',
        cancellable: false
    }, async (progress, token) => {
        writeLog(`HSH_AddOn4VSC gestartet - Initialisierung beginnt!`, 'INFO')
        setOS() /** Setzt die entsprechende Boolean für das jeweilige Betriebssystem true */

        if (!getOSBoolean('Windows') && !extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn kein Windows und "vadimcn.vscode-lldb" nicht installiert ist */
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
        }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */

        initLocation() /** Funktion die anhand des Compilers überprüft ob man sich an einem HSH Rechner befindet */
        initConfigurations() /** initialisiert die Programmiersprache zu C */
        initPath() /** Setzt die Pfade für .jsons und Übungsordner */
        initLogFile()

        if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
            openPreFolder() /** Öffnet Ordner je nach dem welche Prog.sprache aktiv ist */
        }

        checkJSON() /** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */
        initStatusBarItem()  /** Initialisiert den Button in der Statusleiste */
        initActivityBar()   /** Ruft Funktion auf die für die Activitybar zuständig ist */
        initCompiler()     /** Compiler initialisieren */

        writeLog(`Initialisierung beendet!`, 'INFO')
    })
}

/** initialisiert die Programmiersprache zu C */
export function initConfigurations() {
    try {
        settings.progLanguage = workspace.getConfiguration('addon4vsc').get('sprache', 'C')
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

/** Funktion die anhand des Compilers überprüft ob man sich an einem HSH Rechner befindet */
function initLocation() {
    if (existsSync(`C:\\Program Files\\mingw64\\bin`)) {
        settings.computerraum = true
    } else {
        settings.computerraum = false
    }

    writeLog(`Location: ${settings.computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO')
}

/** Funktion die die Einstellung ob im Computerraum in den settings einstellt */
export function setComputerraumConfig(tmp: boolean) {
    const oldConfig = getComputerraumConfig()
    settings.computerraum = tmp
    if (oldConfig !== tmp) {
        initPath()
        initExtensionsDir()
        initCompiler()
    }
}

/** Funktion die die Einstellungen vom Computerraum zurückgibt */
export function getComputerraumConfig() {
    return settings.computerraum
}

/** Funktion mit der sich die Programmiersprache in den Settings einstellen lässt */
function setProgLanguageConfig(tmp: string) {
    settings.progLanguage = tmp

    try {
        workspace.getConfiguration('addon4vsc').update('sprache', tmp, ConfigurationTarget.Global)
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

/** Funktion die die Einstellungen der Programmiersprache zurückgibt */
export function getProgLanguageConfig() {
    return settings.progLanguage
}

/** Funktion die den Button in der Statusbar definiert */
async function initStatusBarItem() {
    settings.statusBarButton.text = 'HSH_AddOn4VSC pausieren'
    settings.statusBarButton.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
    settings.statusBarButton.command = 'extension.off'
    settings.statusBarButton.show()
}

/** Funktion die statusbar_button Variable zurückgibt und somit global verfügbar macht */
export function getStatusBarItem() {
    return settings.statusBarButton
}

/** Globale Funktion die den Compiler installiert und die Pfade setzt*/
export async function initCompiler() {
    if (getOSBoolean('Windows')) {
        initExtensionsDir() /** Funktion die überprüft ob HSH Rechner und ggf. Extensions Pfad einstellt */
        await deleteOldPath('C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin')
        if (getComputerraumConfig()) {
            await addNewPath('C:\\Program Files\\mingw64\\bin')
        } else {
            await addNewPath('C:\\ProgramData\\chocolatey\\bin')
            await addNewPath('C:\\ProgramData\\chocolatey\\lib\\mingw\\tools\\install\\mingw64\\bin')
        }
    }

    exec('gcc --version', (error, stdout) => { /** Prüft ob eine gcc version installiert ist */
        if (error) { /** Wenn Fehler auftritt (keine Version installiert ist) */
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(getPath().userHome)).then(async () => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (getOSBoolean('Windows')) {
                    if (settings.computerraum) {
                        await addNewPath('C:\\Program Files\\mingw64\\bin')
                    } else {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                        /** Führt den Befehl aus das Skript zur installation auszuführen */
                    }
                } else if (getOSBoolean('MacOS')) { /** wenn Mac, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                } else if (getOSBoolean('Linux')) { /** wenn Linux, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                }
            })
        } else {
            writeLog(`Compiler gefunden! Informationen zum Compiler: ${stdout.trim()} `, 'INFO')
            if (settings.compiler) { /** Falls compiler_stat schon true */
                window.showInformationMessage(`Compiler bereits installiert!`)
            } else { /** Falls compiler_stat noch false, wird dann auf true gesetzt */
                settings.compiler = true
            }
        }
    })

    if ((settings.reloadNeeded && getOSBoolean('Windows'))) {
        restartVSC()
    }
}

/** Funktion die nach dem Dev-C++ Pfad in den systempfaden sucht und löscht */
async function deleteOldPath(tmp: string) {
    const pathToRemove: string = tmp
    let pathVar = await getUserEnvironmentPath()
    const pathDirs = pathVar.split(';')
    const index = pathDirs.indexOf(pathToRemove)
    if (index !== -1) {
        pathDirs.splice(index, 1)
        pathVar = pathDirs.join(';')
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR')
            } else {
                writeLog(`Alte Umgebungsvariable erfolgreich entfernt: ${stdout.trim()}`, 'INFO')
                settings.reloadNeeded = true
            }
        })
    } else {
        writeLog(`Alte Umgebungsvariable ist bereits gelöscht.`, 'INFO')
    }
}

/** Funktion die einen neue Pfade in den Benutzerumgebungsvariablen hinzufügen kann  */
async function addNewPath(tmp: string) {
    const pathToAdd: string = tmp
    let pathVar = await getUserEnvironmentPath()
    const pathDirs = pathVar.split(';')
    if (!pathDirs.includes(pathToAdd)) {
        pathDirs.push(pathToAdd)
        pathVar = pathDirs.join(';')
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR')
            } else {
                writeLog(`Neue Umgebungsvariable (${pathToAdd}) erfolgreich hinzugefügt: ${stdout.trim()}`, 'INFO')
                settings.reloadNeeded = true
            }
        })
    } else {
        writeLog(`Umgebungsvariable ist bereits vorhanden.`, 'INFO')
    }
}

/** Funktion die die Pfade der Umgebungsvariablen auslesen und zurückgeben kann */
export function getUserEnvironmentPath(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('reg query HKCU\\Environment /v Path', (error, stdout) => {
            if (error) {
                reject(error)
            } else {
                const matches = stdout.match(/Path\s+REG_SZ\s+(.*)/)
                if (matches) {
                    resolve(matches[1])
                } else {
                    resolve('')
                }
            }
        })
    })
}

async function initExtensionsDir() {
    if(!settings.initExtensionsDirRunning) {
        settings.initExtensionsDirRunning = true
        const USERHOME = getPath().userHome //Speichert den Username für den Pfad ein
        const VSCUSERDATA = getPath().vscUserData

        const EXTENSIONSDIRPATH = `${USERHOME}\\.vscode\\extensions` //Standard Pfad für die Extensions
        const EXTENSIONSDIRPATH_HSH = join(VSCUSERDATA, 'VSCODE_Extensions') //Neuer Pfad für HSH Rechner

        const CURRENTEXTENSIONPATH = await getUserExtensionDir() //Überpüft die aktuelle Variable

        if (settings.computerraum) { //Wenn im Computerraum aktiv
            if (CURRENTEXTENSIONPATH == EXTENSIONSDIRPATH_HSH) { //Wenn Pfad schon besteht
                writeLog(`Extensionpfad bereits gesetzt: ${EXTENSIONSDIRPATH_HSH}`, "INFO")
            } else {
                exec(`setx VSCODE_EXTENSIONS ${EXTENSIONSDIRPATH_HSH}`) //setzt die Umgebungsvariable
                writeLog(`Extensionspfad neu gesetzt: ${EXTENSIONSDIRPATH_HSH}`, 'INFO')
                copyExtensions(EXTENSIONSDIRPATH, EXTENSIONSDIRPATH_HSH) //Kopiert die derzeitigen Addons ins neue Verzeichnis
            }
        } else if (!settings.computerraum && CURRENTEXTENSIONPATH != "%VSCODE_EXTENSIONS%") { //Wenn privater Windowsrechner und es ist ein Pfad gesetzt
            exec(`setx VSCODE_EXTENSIONS ""`) //Setzt die Variable wieder zurück
            writeLog(`Extensionspfad zurückgesetzt`, 'INFO')
        }
        settings.initExtensionsDirRunning = false
    }
}

/** Funktion die den VSCODE_EXTENSIONS Pfad ausliest */
export function getUserExtensionDir(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('echo %VSCODE_EXTENSIONS%', (error, stdout) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout.trim())
            }
        })
    })
}

//Funktion die den Ordner der Extensions kopiert
function copyExtensions(sourcePath: string, destPath: string) {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Kopiere Extensions...',
        cancellable: false
    }, async (progress, token) => {
        try {
            await fs.ensureDir(destPath)
            writeLog(`Kopiervorgang der Extensions begonnen`, 'INFO')
            progress.report({ message: "Kopiervorgang...", increment: 50 })
            await fs.copy(sourcePath, destPath, {
                overwrite: true,
                errorOnExist: false,
            })
            writeLog(`Kopiervorgang der Extensions abgeschlossen`, 'INFO')
            progress.report({ message: "Kopiervorgang beendet", increment: 100 })
            //TODO Auto Neustart der die Umgebungsvariablen mit aktualisiert.
        } catch (err) {
            writeLog(`Fehler beim kopieren des Addons: ${err}`, 'ERROR')
            window.showErrorMessage("Bei dem Kopieren ist ein Fehler aufgetreten!")
        }
    }).then(() => {
        restartVSC()
    })
}

function restartVSC() {
    window.showWarningMessage(writeLog(`VSCode wird jetzt beendet, bitte VSCode manuell neu starten!`, 'WARNING'), { modal: true }, 'OK')
        .then(() => {
            exec('taskkill /im code.exe /f', (error, stdout, stderr) => {
                if (error) {
                    writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
                }
            })
        })
}
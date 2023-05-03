/** Disese Modul enthält Funktionen die für die Initialisierung. Mit diesem Modul werden die Pfade für 
 *  die .jsons, den Übungsordner und den compiler erstellt. Desweitern wird mithilfe des Skripts der 
 *  Compiler gedownloadet. Darüber hinaus enthält das Modul Funktion die bestimmen ob es sich um ein
 *  privaten oder HSH Rechner handelt.
 */

import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, ProgressLocation
} from 'vscode'                     /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { homedir } from 'os'        /** Importiert die homedir Funktion aus dem Node.js Modul.  Die homedir-Funktion gibt das Heimatverzeichnis des aktuellen Benutzers als Zeichenfolge zurück. */
import { exec } from 'child_process'/** Importiert die exec Funktion aus dem Node.js Modul. Die exec-Funktion wird verwendet, um einen Befehl in der Befehlszeile auszuführen. */

import { initActivityBar } from './activity_bar'/** Importiert die Funktion die in der Activitybar die Links einfügt */
import { openPreFolder } from './checkfolder'	/** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkJSON } from './jsonfilescheck'    /** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { initLogFile, writeLog } from './logfile'
import { existsSync, mkdirSync } from 'fs'

let os = { windows: false, osx: false, linux: false }
let path = {
    userHomeFolder: "", CUebung: "", JavaUebung: "", PythonUebung: "", settingsJSON: "",
    tasksJSON: "", testProgC: "", testProgJava: "", testProgPython: "", addOnDir: ""
}
let settings = {
    computerraum: false, progLanguage: "", compiler: false,
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
        uninstallExtensions() // TODO: Später wieder rausnehmen
        if (!getOS('WIN') && !extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn kein Windows und "vadimcn.vscode-lldb" nicht installiert ist */
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
        }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */

        initLocation()
        initConfigurations()
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

/** Funktion die Überprüft welches Betriebssystem vorliegt und entsprechend die Boolean setzt */
function setOS() {
    let tmp: string = ''
    os.windows = process.platform.startsWith('win')
    os.osx = process.platform == 'darwin'
    os.linux = !os.windows && !os.osx

    if (os.windows) {
        tmp = "Windows"
    } else if (os.osx) {
        tmp = "MacOS"
    } else if (os.linux) {
        tmp = "Linux"
    } else {
        tmp = "Betriebssystem wurde nicht erkannt!"
    }

    writeLog(`Folgendes Betriebssystem wurde erkannt: ${tmp}`, 'INFO')
}

/** Funktion die WIN, MAC oder LIN als Eingabe bekommnt und entsprechend den Boolschen Status zurückgibt */
export function getOS(tmp: string) {
    switch (tmp) {
        case 'WIN':
            return os.windows
        case 'MAC':
            return os.osx
        case 'LIN':
            return os.linux
        default:
            return false
    }
}

function uninstallExtensions() {
    try {
        if (extensions.getExtension('vscjava.vscode-java-pack')) {
            commands.executeCommand('workbench.extensions.uninstallExtension', 'vscjava.vscode-java-pack', true)
        }
        if (extensions.getExtension('ms-python.python')) {
            commands.executeCommand('workbench.extensions.uninstallExtension', 'ms-python.python', true)
        }
    } catch (error) {
        console.log(error)
    }
}

export function initConfigurations() {
    try {
        settings.progLanguage = workspace.getConfiguration('addon4vsc').get('sprache', 'C')
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

function initLocation() {
    if (existsSync(`C:\\Program Files\\mingw64\\bin`)) {
        settings.computerraum = true
    } else {
        settings.computerraum = false
    }

    writeLog(`Location: ${settings.computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO')
}

export function setComputerraumConfig(tmp: boolean) {
    settings.computerraum = tmp
}

export function getComputerraumConfig() {
    return settings.computerraum
}

function setProgLanguageConfig(tmp: string) {
    settings.progLanguage = tmp

    try {
        workspace.getConfiguration('addon4vsc').update('sprache', tmp, ConfigurationTarget.Global)
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

export function getProgLanguageConfig() {
    return settings.progLanguage
}

/** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
export function initPath() {
    path.userHomeFolder = homedir()
    if (os.windows && settings.computerraum) {
        path.addOnDir = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\HSH_AddOn4VSC`
        path.CUebung = `U:\\C_Uebung`
        path.JavaUebung = `U:\\Java_Uebung`
        path.PythonUebung = `U:\\Python_Uebung`
        path.settingsJSON = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        path.tasksJSON = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        path.testProgC = `${path.CUebung}\\testprog.c`
        path.testProgJava = `${path.JavaUebung}\\HelloWorld.java`
        path.testProgPython = `${path.PythonUebung}\\HelloWorld.py`
    } else if (os.windows && !settings.computerraum) {
        path.addOnDir = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\HSH_AddOn4VSC`
        path.CUebung = `${path.userHomeFolder}\\Documents\\C_Uebung`
        path.JavaUebung = `${path.userHomeFolder}\\Documents\\Java_Uebung`
        path.PythonUebung = `${path.userHomeFolder}\\Documents\\Python_Uebung`
        path.settingsJSON = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        path.tasksJSON = `${path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        path.testProgC = `${path.CUebung}\\testprog.c`
        path.testProgJava = `${path.JavaUebung}\\HelloWorld.java`
        path.testProgPython = `${path.PythonUebung}\\HelloWorld.py`
    } else if (os.osx) { /** Wenn MAC */
        path.addOnDir = `${path.userHomeFolder}/Library/Application Support/Code/User/HSH_AddOn4VSC`
        path.CUebung = `${path.userHomeFolder}/Documents/C_Uebung`
        path.JavaUebung = `${path.userHomeFolder}/Documents/Java_Uebung`
        path.PythonUebung = `${path.userHomeFolder}/Documents/Python_Uebung`
        path.settingsJSON = `${path.userHomeFolder}/Library/Application Support/Code/User/settings.json`
        path.tasksJSON = `${path.userHomeFolder}/Library/Application Support/Code/User/tasks.json`
        path.testProgC = `${path.CUebung}/testprog.c`
        path.testProgJava = `${path.JavaUebung}/HelloWorld.java`
        path.testProgPython = `${path.PythonUebung}/HelloWorld.py`
    } else if (os.linux) { /** Wenn Linux */
        path.addOnDir = `${path.userHomeFolder}/.config/Code/User/HSH_AddOn4VSC`
        path.CUebung = `${path.userHomeFolder}/Documents/C_Uebung`
        path.JavaUebung = `${path.userHomeFolder}/Documents/Java_Uebung`
        path.PythonUebung = `${path.userHomeFolder}/Documents/Python_Uebung`
        path.settingsJSON = `${path.userHomeFolder}/.config/Code/User/settings.json`
        path.tasksJSON = `${path.userHomeFolder}/.config/Code/User/tasks.json`
        path.testProgC = `${path.CUebung}/testprog.c`
        path.testProgJava = `${path.JavaUebung}/HelloWorld.java`
        path.testProgPython = `${path.PythonUebung}/HelloWorld.py`
    }

    if (!existsSync(path.addOnDir)) {
        mkdirSync(path.addOnDir)
    }
}

/** Funktion, die die Pfade zurückgibt und somit global verfügbar macht
 * 
 * (Pfade werden entsprechend der Programmiersprache richtig gesetzt)
 * 
 * Verfügbare Argumente:
 * - settingsjson
 * - tasksjson
 * - compiler
 * - testprog
 * - uebungfolder
 * - addondirÌ
*/
export function getPath(tmp: string) {
    switch (tmp) {
        case 'settingsjson':
            return path.settingsJSON
        case 'tasksjson':
            return path.tasksJSON
        case 'testprog':
            switch (settings.progLanguage) {
                case 'C':
                    return path.testProgC
                case 'Java':
                    return path.testProgJava
                case 'Python':
                    return path.testProgPython
                default:
                    return ''
            }
        case 'uebungfolder':
            switch (settings.progLanguage) {
                case 'C':
                    return path.CUebung
                case 'Java':
                    return path.JavaUebung
                case 'Python':
                    return path.PythonUebung
                default:
                    return ''
            }
        case 'addondir':
            return path.addOnDir
        default:
            writeLog(`Unbekanntes Argument für getPath: ${tmp}`, 'ERROR')
            return ''
    }
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

/** Globale Funktion die den Compiler installiert */
export async function initCompiler() {
    if (getOS('WIN')) {
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
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(path.userHomeFolder)).then(async () => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (getOS('WIN')) {
                    if (settings.computerraum) {
                        await addNewPath('C:\\Program Files\\mingw64\\bin')
                    } else {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                        /** Führt den Befehl aus das Skript zur installation auszuführen */
                    }
                } else if (os.osx) { /** wenn Mac, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                } else if (os.linux) { /** wenn Linux, führt Skript zur installation aus */
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
}

async function deleteOldPath(tmp: string) {
    const pathToRemove: string = 'C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin'
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
            }
        })
    } else {
        writeLog(`Alte Umgebungsvariable ist bereits gelöscht.`, 'INFO')
    }
}

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
                writeLog(`Alte Umgebungsvariable erfolgreich entfernt: ${stdout.trim()}`, 'INFO')
            }
        })
    } else {
        writeLog(`Umgebungsvariable ist bereits vorhanden.`, 'INFO')
    }
}

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
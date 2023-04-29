/** Disese Modul enthält Funktionen die für die Initialisierung. Mit diesem Modul werden die Pfade für 
 *  die .jsons, den Übungsordner und den compiler erstellt. Desweitern wird mithilfe des Skripts der 
 *  Compiler gedownloadet. Darüber hinaus enthält das Modul Funktion die bestimmen ob es sich um ein
 *  privaten oder HSH Rechner handelt.
 */

import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, StatusBarItem
} from 'vscode'                     /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { homedir } from 'os'        /** Importiert die homedir Funktion aus dem Node.js Modul.  Die homedir-Funktion gibt das Heimatverzeichnis des aktuellen Benutzers als Zeichenfolge zurück. */
import { exec } from 'child_process'/** Importiert die exec Funktion aus dem Node.js Modul. Die exec-Funktion wird verwendet, um einen Befehl in der Befehlszeile auszuführen. */

import { activityBarMain, treeDataProvider } from './activity_bar'  /** Importiert die Funktion die in der Activitybar die Links einfügt */
import { openprefolder } from './checkfolder'		                /** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkjsons, renewjsons } from './jsonfilescheck'		    /** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { logFileMain, writeLog } from './logfile'
import { existsSync } from 'fs'

interface IEnvironmentVariables {
    os: {   /** Definiert Bool's für die einzelnen Betriebssysteme */
        IS_WINDOWS: boolean
        IS_OSX: boolean
        IS_LINUX: boolean
    }
    path: { /** Definiert eine Reihe von String-Vaariablen */
        userHomeFolder: string /** Speichert das Heimatvereichnis des Benutzers */
        CUebung: string
        JavaUebung: string
        PythonUebung: string
        settingsJSON: string
        tasksJSON: string
        compiler: string
        testProgC: string
        testProgJava: string
        testProgPython: string
        logFileDir: string
    }
    settings: {
        encodingSettingsJSON: string
    }
    status: {
        compiler: boolean /** Boolean die angibt ob Compiler initialisiert wurde und keinen Fehler ausgibt */
    }
}

let envVar: IEnvironmentVariables = { 
    os: { IS_WINDOWS: false, IS_OSX: false, IS_LINUX: false },
    path: { userHomeFolder: "", CUebung: "", JavaUebung: "", PythonUebung: "", settingsJSON: "", tasksJSON: "", compiler: "", testProgC: "", testProgJava: "", testProgPython: "", logFileDir: "" },
    settings: { encodingSettingsJSON: "" }, status: { compiler: false }
}

let statusbar_button: StatusBarItem /** Definiert statusbar_button als StatusBarItem */

/** Hauptfunktion die die Initialisierung durchführt und wenn erfolgreich setting_init true setzt. */
export async function initMain() {
    setOS() /** Setzt die entsprechende Boolean für das jeweilige Betriebssystem true */
    if(envVar.os.IS_WINDOWS && await getConfigComputerraum() === null) {
        initPrivateOrHsh()
    }

    if (!getOS('WIN') && !extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn kein Windows und "vadimcn.vscode-lldb" nicht installiert ist */
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
    }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */

    setPath()    /** Setzt die Pfade für .jsons und Übungsordner */
    setFilesEncoding()
    logFileMain()
    checkjsons() /** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */

    if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
        openprefolder() /** Öffnet Ordner je nach dem welche Prog.sprache aktiv ist */
    }

    setStatusBarItem()  /** Initialisiert den Button in der Statusleiste */
    activityBarMain()   /** Ruft Funktion auf die für die Activitybar zuständig ist */
    compiler_init()     /** Compiler initialisieren */

    writeLog(`HSH_AddOn4VSC gestartet - init.ts initialisiert!`, 'INFO')
}

/** Funktion die Überprüft welches Betriebssystem vorliegt und entsprechend die Boolean setzt */
function setOS() {
    envVar.os.IS_WINDOWS = process.platform.startsWith('win')
    envVar.os.IS_OSX = process.platform == 'darwin'
    envVar.os.IS_LINUX = !envVar.os.IS_WINDOWS && !envVar.os.IS_OSX
}

/** Funktion die  WIN, MAC oder LIN als Eingabe bekommnt und entsprechend den Boolschen Status zurückgibt */
export function getOS(os: string) {
    switch(os) {
        case 'WIN':
            return envVar.os.IS_WINDOWS
        case 'MAC':
            return envVar.os.IS_OSX
        case 'LIN':
            return envVar.os.IS_LINUX
        default:
            return false
    }
}

/** Funktion die den Button in der Statusbar definiert */
function setStatusBarItem() {
    statusbar_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    statusbar_button.text = 'HSH_AddOn4VSC pausieren'
    statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
    statusbar_button.command = 'extension.off'
    statusbar_button.show()
}

/** Funktion die statusbar_button Variable zurückgibt und somit global verfügbar macht */
export function getStatusBarItem() {
    return statusbar_button 
}

function setConfigProgLanguageIntern(tmp: string) {
    workspace.getConfiguration('addon4vsc').update('sprache', tmp, ConfigurationTarget.Global)
}

function setConfigComputerraumIntern(tmp: boolean) {
    workspace.getConfiguration('addon4vsc').update('computerraum', tmp, ConfigurationTarget.Global)
}

export function setConfigComputerraum(tmp: boolean) {
    setConfigComputerraumIntern(tmp)
}

export function getConfigComputerraum() {
    return new Promise((resolve, reject) => {
        let configComputerraum = workspace.getConfiguration('addon4vsc').get('computerraum')
        if (configComputerraum === null) {
            configComputerraum = initPrivateOrHsh()
        }
        resolve(configComputerraum)
    })
}

export function getConfigProgLanguage() {
    return new Promise((resolve, reject) => {
        let configProgLanguage = workspace.getConfiguration('addon4vsc').get('sprache')
        resolve(configProgLanguage)
    })
}

/** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
export async function setPath() {
    const Computerraum = await getConfigComputerraum() as unknown as boolean
    console.log('setPath Computerraum: '+Computerraum)
    envVar.path.userHomeFolder = homedir()
    if (envVar.os.IS_WINDOWS && Computerraum) {
        envVar.path.compiler = 'C:\\\\Program Files\\\\mingw64\\\\bin\\\\gcc.exe'
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `U:\\C_Uebung`
        envVar.path.JavaUebung = `U:\\Java_Uebung`
        envVar.path.PythonUebung = `U:\\Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        envVar.path.testProgC = `${envVar.path.CUebung}\\testprog.c`
        envVar.path.testProgJava = `${envVar.path.JavaUebung}\\HelloWorld.java`
        envVar.path.testProgPython = `${envVar.path.PythonUebung}\\HelloWorld.py`
    } else if (envVar.os.IS_WINDOWS && !Computerraum) {
        envVar.path.compiler = 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}\\Documents\\C_Uebung`
        envVar.path.JavaUebung = `${envVar.path.userHomeFolder}\\Documents\\Java_Uebung`
        envVar.path.PythonUebung = `${envVar.path.userHomeFolder}\\Documents\\Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        envVar.path.testProgC = `${envVar.path.CUebung}\\testprog.c`
        envVar.path.testProgJava = `${envVar.path.JavaUebung}\\HelloWorld.java`
        envVar.path.testProgPython = `${envVar.path.PythonUebung}\\HelloWorld.py`
    } else if (envVar.os.IS_OSX) { /** Wenn MAC */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}/Documents/C_Uebung`
        envVar.path.JavaUebung = `${envVar.path.userHomeFolder}/Documents/Java_Uebung`
        envVar.path.PythonUebung = `${envVar.path.userHomeFolder}/Documents/Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User/settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User/tasks.json`
        envVar.path.testProgC = `${envVar.path.CUebung}/testprog.c`
        envVar.path.testProgJava = `${envVar.path.JavaUebung}/HelloWorld.java`
        envVar.path.testProgPython = `${envVar.path.PythonUebung}/HelloWorld.py`
    } else if (envVar.os.IS_LINUX) { /** Wenn Linux */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}/.config/Code/User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}/Documents/C_Uebung`
        envVar.path.JavaUebung = `${envVar.path.userHomeFolder}/Documents/Java_Uebung`
        envVar.path.PythonUebung = `${envVar.path.userHomeFolder}/Documents/Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}/.config/Code/User/settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}/.config/Code/User/tasks.json`
        envVar.path.testProgC = `${envVar.path.CUebung}/testprog.c`
        envVar.path.testProgJava = `${envVar.path.JavaUebung}/HelloWorld.java`
        envVar.path.testProgPython = `${envVar.path.PythonUebung}/HelloWorld.py`
    } else {
        window.showErrorMessage(writeLog(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt. Bitte neu starten!`, 'ERROR')) /** Falls kein Betriebssystem gefunden worde */
    }
}

/** Funktion, die die Pfade zurückgibt und somit global verfügbar macht
 * (Pfade werden entsprechend der Programmiersprache richtig gesetzt)
 * 
 * Verfügbare Argumente:
 * - settingsjson
 * - tasksjson
 * - compiler
 * - testprog
 * - uebungfolder
 * - logfiledir
*/
export async function getPath(tmp: string) {
    const progLanguage = await getConfigProgLanguage() as unknown as string

    switch(tmp) {
        case 'settingsjson':
            return envVar.path.settingsJSON
        case 'tasksjson':
            return envVar.path.tasksJSON
        case 'compiler':
            return envVar.path.compiler
        case 'testprog':
            switch(progLanguage) {
                case 'C':
                    return envVar.path.testProgC
                case 'Java':
                    return envVar.path.testProgJava
                case 'Python':
                    return envVar.path.testProgPython
                default:
                    return ''
            }
        case 'uebungfolder':
            switch(progLanguage) {
                case 'C':
                    return envVar.path.CUebung
                case 'Java':
                    return envVar.path.JavaUebung
                case 'Python':
                    return envVar.path.PythonUebung
                default:
                    return ''
            }
        case 'logfiledir':
            return envVar.path.logFileDir
        default:
            return ''
    }
}

export function setFilesEncoding() {
    if (envVar.os.IS_WINDOWS) {
        envVar.settings.encodingSettingsJSON = `cp437`
    } else {
        envVar.settings.encodingSettingsJSON = `utf8`
    }
}

/** Globale Funktion die zurückgibt um welche Art der Codierung es sich handelt */
export function getFilesEncoding() {
    return envVar.settings.encodingSettingsJSON
}

export async function onEventComputerraum() {
    if (getOS('WIN')) { /** überprüft ob Windows */
        setPath() /** Setzt Compilerpfad neu */
        renewjsons(await getPath('tasksjson'))  
        treeDataProvider.refresh() /** Aktualisiert die Anzeige der Activity Bar */
        writeLog(`onEventComputerraum durchgeführt!`, 'INFO')
    }						
}

export async function onEventProgLanguage() {
    const Computerraum = getConfigComputerraum()
    const openWorkspace = workspace.workspaceFolders?.toString() || ''

    if (!getOS('WIN') || !Computerraum) {
        window.showWarningMessage(writeLog('Programmiersprache wechseln ist derzeit nur an HsH Rechnern verfügbar!', 'WARNING'))
        return
    }
    setPath()
    if (openWorkspace.includes(await getPath('uebungfolder'))) { /** überprüft ob sich der Wert geändert hat */
        commands.executeCommand('workbench.action.closeFolder')
    }					
}

function initPrivateOrHsh() {
    if (envVar.os.IS_WINDOWS && existsSync(`C:\\Program Files\\mingw64\\bin`)) {
        setConfigComputerraum(true)
        return true
    } else {
        setConfigComputerraum(false)
        return false
    }
}

async function deleteOldPath() {
    if (envVar.os.IS_WINDOWS) {
        const pathToRemove = 'C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin'
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
            writeLog(`Alte Umgebungsvariable ist bereits gelöscht.`,'INFO')
        }
    }
}

async function addNewPath() {
    const pathToAdd = 'C:\\Program Files\\mingw64\\bin';
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
        writeLog(`Umgebungsvariable ist bereits vorhanden.`,'INFO')
    }
}

function getUserEnvironmentPath(): Promise<string> {
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

/** Globale Funktion die den Compiler installiert */
export async function compiler_init() {
    await deleteOldPath()

    exec('gcc --version', (error, stdout) => { /** Prüft ob eine gcc version installiert ist */
        if (error) { /** Wenn Fehler auftritt (keine Version installiert ist) */
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(envVar.path.userHomeFolder)).then(async () => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (envVar.os.IS_WINDOWS) {
                    initPrivateOrHsh()

                    if (await getConfigComputerraum()) {
                        await addNewPath()
                    } else {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                        /** Führt den Befehl aus das Skript zur installation auszuführen */
                    }
                } else if (envVar.os.IS_OSX) { /** wenn Mac, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                } else if (envVar.os.IS_LINUX) { /** wenn Linux, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                }
            })
        } else {
            writeLog(`Compiler gefunden! Informationen zum Compiler: ${stdout.trim()} `, 'INFO')
            if (envVar.status.compiler) { /** Falls compiler_stat schon true */
                window.showInformationMessage(`Compiler bereits installiert!`)
            } else { /** Falls compiler_stat noch false, wird dann auf true gesetzt */
                envVar.status.compiler = true
            }
        }
    })
}
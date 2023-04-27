/** Disese Modul enthält Funktionen die für die Initialisierung. Mit diesem Modul werden die Pfade für 
 *  die .jsons, den Übungsordner und den compiler erstellt. Desweitern wird mithilfe des Skripts der 
 *  Compiler gedownloadet. Darüber hinaus enthält das Modul Funktion die bestimmen ob es sich um ein
 *  privaten oder HSH Rechner handelt.
 */

// TODO: Für java und python einmal compiler init umstrukturieren!

import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, StatusBarItem
} from 'vscode'     /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { homedir } from 'os'    /** Importiert die homedir Funktion aus dem Node.js Modul.  Die homedir-Funktion gibt das Heimatverzeichnis des aktuellen Benutzers als Zeichenfolge zurück. */
import { exec } from 'child_process'    /** Importiert die exec Funktion aus dem Node.js Modul. Die exec-Funktion wird verwendet, um einen Befehl in der Befehlszeile auszuführen. */

import { activityBarMain } from './activity_bar'    /** Importiert die Funktion die in der Activitybar die Links einfügt */
import { openprefolder } from './checkfolder'		/** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkjsons } from './jsonfilescheck'		/** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { getConstCommands } from './constants'         /** Importiert die Namen und Beschreibungen der Commands aus constants.ts*/
import { logFileMain, writeLog } from './logfile'
import { existsSync } from 'fs'

interface IEnvironmentVariables {
    os: {   /** Definiert Bool's für die einzelnen Betriebssysteme */
        IS_WINDOWS: boolean
        IS_OSX: boolean
        IS_LINUX: boolean
    },
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
    },
    settings: {
        hshRZ: boolean | null /** Boolean die angibt ob es sich um einen PC im Rechnerraum handelt*/
        progLanguage: string | undefined
        encodingSettingsJSON: string
    },
    status: {
        compiler: boolean /** Boolean die angibt ob Compiler initialisiert wurde und keinen Fehler ausgibt */
    }
}

let envVar: IEnvironmentVariables = { 
    os: { IS_WINDOWS: false, IS_OSX: false, IS_LINUX: false },
    path: { userHomeFolder: "", CUebung: "", JavaUebung: "", PythonUebung: "", settingsJSON: "", tasksJSON: "", compiler: "", testProgC: "", testProgJava: "", testProgPython: "", logFileDir: "" },
    settings: { hshRZ: null, progLanguage: undefined, encodingSettingsJSON: "" }, status: { compiler: false }
}

let statusbar_button: StatusBarItem /** Definiert statusbar_button als StatusBarItem */

/** Hauptfunktion die die Initialisierung durchführt und wenn erfolgreich setting_init true setzt. */
export async function initMain() {
    setOS() /** Setzt die entsprechende Boolean für das jeweilige Betriebssystem true */
    await workspace.getConfiguration('addon4vsc').get('computerraum') === null && envVar.os.IS_WINDOWS ? initHshRz() : ''
    envVar.settings.progLanguage = await workspace.getConfiguration('addon4vsc').get('sprache')

    if (!getOS('WIN')) { /** "Wenn die Boolean IS_Windows false ist */
        if (!extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn "vadimcn.vscode-lldb" nicht installiert ist */
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
        }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */
    }

    // init_language()

    setPath()       /** Setzt die Pfade für .jsons und Übungsordner */
    logFileMain()
    checkjsons()    /** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */

    if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
        openprefolder() /** Öffnet Ordner je nach dem welche Prog.sprache aktiv ist */
    }

    setStatusBarItem()  /** Initialisiert den Button in der Statusleiste */
    activityBarMain()   /** Ruft Funktion auf die für die Activitybar zuständig ist */
    compiler_init()     /** Compiler initialisieren */

    writeLog(`HSH_AddOn4VSC gestartet - Initialisierung beendet!`, 'INFO')
}
/** Funktion die Überprüft welches Betriebssystem vorliegt
 * und entsprechend die Boolean setzt */
function setOS() {
    envVar.os.IS_WINDOWS = process.platform.startsWith('win')
    envVar.os.IS_OSX = process.platform == 'darwin'
    envVar.os.IS_LINUX = !envVar.os.IS_WINDOWS && !envVar.os.IS_OSX
}

/** Funktion die  WIN, MAC oder LIN als Eingabe bekommnt
 * und entsprechend den Boolschen Status zurückgibt */
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

/** Funktion die hshRZ Variable zurückgibt und somit global verfügbar macht */
export function getHsHRZ() {
    return envVar.settings.hshRZ
}

/** Funktion die die Pfade zurückgibt und somit global verfügbar macht
 * (Pfade werden entsprechend der Programmiersprache richtig gesetzt)
 * 
 * Verfügbare Argumente:
 * - settingsjson
 * - tasksjson
 * - testprog
 * - uebungfolder
 * - logfiledir
*/
export function getPath(temp: string) {
    switch(temp) {
        case 'settingsjson':
            return envVar.path.settingsJSON
        case 'tasksjson':
            return envVar.path.tasksJSON
        case 'testprog':
            if (envVar.settings.progLanguage === 'C') {
                return envVar.path.testProgC
            } else if (envVar.settings.progLanguage === 'Java') {
                return envVar.path.testProgJava
            } else if (envVar.settings.progLanguage === 'Python') {
                return envVar.path.testProgPython
            } else {
                return ''
            }
        case 'uebungfolder':
            if (envVar.settings.progLanguage === 'C') {
                return envVar.path.CUebung
            } else if (envVar.settings.progLanguage === 'Java') {
                return envVar.path.JavaUebung
            } else if (envVar.settings.progLanguage === 'Python') {
                return envVar.path.PythonUebung
            } else {
                return ''
            }
        case 'logfiledir':
            return envVar.path.logFileDir
        default:
            return ''
    }
}

/** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
export function setPath() {
    envVar.path.userHomeFolder = homedir()
    /** Je nach dem ob im Rechneraum oder nicht wird der enstprechende Compiler-Pfad gespeichert */
    envVar.path.compiler = envVar.settings.hshRZ ? 'C:\\\\Program Files\\\\mingw64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
    envVar.settings.encodingSettingsJSON = envVar.os.IS_WINDOWS ? `cp437` : `utf8` /** Je nach dem ob Windows oder nicht wird Codierung gespeichert*/

    if (envVar.os.IS_WINDOWS && !envVar.settings.hshRZ) { /** Wenn windows und privater Rechner */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}\\Documents\\C_Uebung`
        envVar.path.JavaUebung = `${envVar.path.userHomeFolder}\\Documents\\Java_Uebung`
        envVar.path.PythonUebung = `${envVar.path.userHomeFolder}\\Documents\\Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        envVar.path.testProgC = `${envVar.path.CUebung}\\testprog.c`
        envVar.path.testProgJava = `${envVar.path.JavaUebung}\\HelloWorld.java`
        envVar.path.testProgPython = `${envVar.path.PythonUebung}\\HelloWorld.py`
    } else if (envVar.os.IS_WINDOWS && envVar.settings.hshRZ) { /** Wenn windows und HSH Rechner */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `U:\\C_Uebung`
        envVar.path.JavaUebung = `U:\\Java_Uebung`
        envVar.path.PythonUebung = `U:\\Python_Uebung`
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

/** Globale Funktion die den Compiler installiert */
export function compiler_init() {
    if (envVar.settings.hshRZ) {
        const pathToRemove = 'C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin'
        exec(`setx PATH "$(echo %PATH:${pathToRemove}=;%)";`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR')
            } else {
                writeLog(`Alte Umgebungsvariable erfolgreich entfernt: ${stdout}`, 'INFO')
            }
        })
    }
    exec('gcc --version', (error, stdout) => { /** Prüft ob eine gcc version installiert ist */
        if (error) { /** Wenn Fehler auftritt (keine Version installiert ist) */
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(envVar.path.userHomeFolder)).then(() => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (envVar.os.IS_WINDOWS) {
                    if (existsSync(`C:\\Program Files\\mingw64\\bin`)) {
                        workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable true */
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx PATH \"%PATH%;C:\\Program Files\\mingw64\\bin\"\n' })
                        changeHsHOrPrivate(true) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
                    } else {
                        workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable false */
                        changeHsHOrPrivate(false) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
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
            writeLog(`Compiler gefunden!`, 'INFO')
            if (envVar.status.compiler) { /** Falls compiler_stat schon true */
                window.showInformationMessage(`Compiler bereits installiert! Informationen zum Compiler: ${stdout}`)
            } else { /** Falls compiler_stat noch false, wird dann auf true gesetzt */
                envVar.status.compiler = true
            }
        }
    })
}

/** Globale asynchrone Funktion die Ändert ob es sich um privaten oder HSH Rechner handelt */
export async function setRZHsH() {
    if (!envVar.os.IS_WINDOWS) { /** Überprüft ob es sich um einen Windows PC handelt */
        window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
        return
    } else {
        if (workspace.getConfiguration('addon4vsc').get('computerraum')) { /** Überprüft ob die Einstellung computerraum in settings.json true ist */
            window.showInformationMessage('Auf privater Windows-Rechner gestellt.')
        } else {
            window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.')
        }
        workspace.getConfiguration('addon4vsc').update('computerraum', !workspace.getConfiguration('addon4vsc').get('computerraum'), ConfigurationTarget.Global) /** Invertiert die Einstellung in settings.json Computerraum */
        envVar.path.compiler = workspace.getConfiguration('addon4vsc').get('computerraum') ? 'C:\\\\Program Files\\\\mingw64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
        /** Speichert den neuen Compilerpfad ein */
        changeHsHOrPrivate(!envVar.settings.hshRZ) /** Ruft Funktion auf die die Boolean ändert die für privat oder HSH Rechner steht */
    }
}

/** Globale Funktion die die hshRZ Boolean überschreibt */
export function sethshRZ(ext_hshRZ: boolean) {
    envVar.settings.hshRZ = ext_hshRZ
}

/** Globale Funktion die den Compilerpfad zurückgibt */
export function getCompilerPath() {
    return envVar.path.compiler
}

/** Globale Funktion die zurückgibt um welche Art der Codierung es sich handelt */
export function getFilesEncoding() {
    return envVar.settings.encodingSettingsJSON
}

/** Funktion die die Einstellung der Boolean anwendet und den Compiler-Pfad + task.json aktualisiert */
export async function changeHsHOrPrivate(temp_hshRZ: boolean) {
    sethshRZ(temp_hshRZ)
    setPath()   /** Setzt Compilerpfad neu */
    await commands.executeCommand(getConstCommands()[3].command)   /** Führt command 3 aus, "tasks.json zurücksetzen" */                        
}

export function getProgLanguage() {
    return envVar.settings.progLanguage
}

export function setProgLanguage(tmp: string) {
    envVar.settings.progLanguage = tmp
}

function initHshRz() {
    if (existsSync(`C:\\Program Files\\mingw64\\bin`)) {
        workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable true */
        sethshRZ(true)
    } else {
        workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable false */
        sethshRZ(false)
    }
}
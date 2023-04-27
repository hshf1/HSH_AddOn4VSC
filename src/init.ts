/** Disese Modul enthält Funktionen die für die Initialisierung. Mit diesem Modul werden die Pfade für 
 *  die .jsons, den Übungsordner und den compiler erstellt. Desweitern wird mithilfe des Skripts der 
 *  Compiler gedownloadet. Darüber hinaus enthält das Modul Funktion die bestimmen ob es sich um ein
 *  privaten oder HSH Rechner handelt.
 */

// TODO: Nach update im HsH Computerraum müssen Variablen und Funktionen hier angepasst werden

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
import { get_active_prog_language } from './language_handler'
import { logFileMain, writeLog } from './logfile'

interface IEnvironmentVariables {
    os: {   /** Definiert Bool's für die einzelnen Betriebssysteme */
        IS_WINDOWS: boolean,
        IS_OSX: boolean,
        IS_LINUX: boolean
    },
    path: { /** Definiert eine Reihe von String-Vaariablen */
        userHomeFolder: string, /** Speichert das Heimatvereichnis des Benutzers */
        CUebung: string,
        settingsJSON: string,
        tasksJSON: string,
        compiler: string,
        testProg: string,
        logFileDir: string
    },
    settings: {
        hshRZ: boolean | undefined, /** Boolean die angibt ob es sich um einen PC im Rechnerraum handelt*/
        encodingSettingsJSON: string
    },
    status: {
        compiler: boolean /** Boolean die angibt ob Compiler initialisiert wurde und keinen Fehler ausgibt */
    }
}

let envVar: IEnvironmentVariables = { 
    os: { IS_WINDOWS: false, IS_OSX: false, IS_LINUX: false },
    path: { userHomeFolder: "", CUebung: "", settingsJSON: "", tasksJSON: "", compiler: "", testProg: "", logFileDir: "" },
    settings: { hshRZ: undefined, encodingSettingsJSON: "" }, status: { compiler: false }
}

let statusbar_button: StatusBarItem /** Definiert statusbar_button als StatusBarItem */

/** Hauptfunktion die die Initialisierung durchführt und wenn erfolgreich setting_init true setzt. */
export function initMain() {
    setOS() /** Setzt die entsprechende Boolean für das jeweilige Betriebssystem true */

    if (!getOS('WIN')) { /** "Wenn die Boolean IS_Windows false ist */
        if (!extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn "vadimcn.vscode-lldb" nicht installiert ist */
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
        }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */
    }

    while (envVar.settings.hshRZ === undefined) { /** Überprüft ob Rechnerraum oder nicht */
        envVar.settings.hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
    }

    setPath()       /** Setzt die Pfade für .jsons und Übungsordner */
    checkjsons()    /** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */

    if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
        openprefolder(get_active_prog_language()) /** Öffnet Ordner je nach dem welche Prog.sprache aktiv ist */
    }

    setStatusBarItem()  /** Initialisiert den Button in der Statusleiste */
    activityBarMain()   /** Ruft Funktion auf die für die Activitybar zuständig ist */
    compiler_init()     /** Compiler initialisieren */
    logFileMain()

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
 * 
 * Verfügbare Argumente:
 * - settingsjson
 * - tasksjson
 * - testprog
 * - CUebung
 * - logfiledir
*/
export function getPath(temp: string) {
    switch(temp) {
        case 'settingsjson':
            return envVar.path.settingsJSON
        case 'tasksjson':
            return envVar.path.tasksJSON
        case 'testprog':
            return envVar.path.testProg
        case 'testprogjava':
            return filePath_testprogjava
        case 'testprogpython':
            return filePath_testprogpython
        case 'CUebung':
            return envVar.path.CUebung
        case 'JavaUebung':
            return folderPath_Java_Uebung
        case 'PythonUebung':
            return folderPath_Python_Uebung
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
    envVar.path.compiler = envVar.settings.hshRZ ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
    envVar.settings.encodingSettingsJSON = envVar.os.IS_WINDOWS ? `cp437` : `utf8` /** Je nach dem ob Windows oder nicht wird Codierung gespeichert*/

    if (envVar.os.IS_WINDOWS && !envVar.settings.hshRZ) { /** Wenn windows und privater Rechner */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}\\Documents\\C_Uebung`
        folderPath_Java_Uebung = `${userhomefolder}\\Documents\\Java_Uebung`
        folderPath_Python_Uebung = `${userhomefolder}\\Documents\\Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        envVar.path.testProg = `${envVar.path.CUebung}\\testprog.c`
        filePath_testprogjava = `${folderPath_Java_Uebung}\\HelloWorld.java`
        filePath_testprogpython = `${folderPath_Python_Uebung}\\HelloWorld.py`
    } else if (envVar.os.IS_WINDOWS && envVar.settings.hshRZ) { /** Wenn windows und HSH Rechner */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User`
        envVar.path.CUebung = `U:\\C_Uebung`
        folderPath_Java_Uebung = `U:\\Java_Uebung`
        folderPath_Python_Uebung = `U:\\Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        envVar.path.testProg = `${envVar.path.CUebung}\\testprog.c`
        filePath_testprogjava = `${folderPath_Java_Uebung}\\HelloWorld.java`
        filePath_testprogpython = `${folderPath_Python_Uebung}\\HelloWorld.py`
    } else if (envVar.os.IS_OSX) { /** Wenn MAC */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}/Documents/C_Uebung`
        folderPath_Java_Uebung = `${userhomefolder}/Documents/Java_Uebung`
        folderPath_Python_Uebung = `${userhomefolder}/Documents/Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User/settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}/Library/Application Support/Code/User/tasks.json`
        envVar.path.testProg = `${envVar.path.CUebung}/testprog.c`
        filePath_testprogjava = `${folderPath_Java_Uebung}/HelloWorld.java`
        filePath_testprogpython = `${folderPath_Python_Uebung}/HelloWorld.py`
    } else if (envVar.os.IS_LINUX) { /** Wenn Linux */
        envVar.path.logFileDir = `${envVar.path.userHomeFolder}/.config/Code/User`
        envVar.path.CUebung = `${envVar.path.userHomeFolder}/Documents/C_Uebung`
        folderPath_Java_Uebung = `${userhomefolder}/Documents/Java_Uebung`
        folderPath_Python_Uebung = `${userhomefolder}/Documents/Python_Uebung`
        envVar.path.settingsJSON = `${envVar.path.userHomeFolder}/.config/Code/User/settings.json`
        envVar.path.tasksJSON = `${envVar.path.userHomeFolder}/.config/Code/User/tasks.json`
        envVar.path.testProg = `${envVar.path.CUebung}/testprog.c`
        filePath_testprogjava = `${folderPath_Java_Uebung}/HelloWorld.java`
        filePath_testprogpython = `${folderPath_Python_Uebung}/HelloWorld.py`
    } else {
        window.showErrorMessage(writeLog(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt. Bitte neu starten!`, 'ERROR')) /** Falls kein Betriebssystem gefunden worde */
    }
}

/** Globale Funktion die den Compiler installiert */
export function compiler_init() {
    exec('gcc --version', (error, stdout) => { /** Prüft ob eine gcc version installiert ist */
        if (error) { /** Wenn Fehler auftritt (keine Version installiert ist) */
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(envVar.path.userHomeFolder)).then(() => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (envVar.os.IS_WINDOWS) {
                    window.showInformationMessage(writeLog(`Compiler nicht gefunden.`, 'INFO') + ` Zum installieren bitte auswählen:`, 'Privater Windows-Rechner', 'HsH Windows-Rechner', 'Jetzt nicht').then(async selected => { /** Fragt ob HSH oder Privater Rechner und wartet auf Antwort */
                        if (selected === 'Privater Windows-Rechner') { /** Wenn Privater Rechner */
                            workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable false */
                            changeHsHOrPrivate(false) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                            /** Führt den Befehl aus das Skript zur installation auszuführen */
                        } else if (selected === 'HsH Windows-Rechner') { /** wenn HSH Rechner */
                            workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable true */
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx Path \"%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\"\n' })
                            envVar.path.compiler = 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' /** Setzt den Compilerpfad */
                            changeHsHOrPrivate(true) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
                            await new Promise(resolve => setTimeout(resolve, 5000)) /** Wartet 5 Sekunden */
                            commands.executeCommand('workbench.action.reloadWindow') /** Lädt alle VS-Code Fenster neu, wodurch neue Änderungen aktiv werden*/
                        }
                    })
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
        envVar.path.compiler = workspace.getConfiguration('addon4vsc').get('computerraum') ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
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

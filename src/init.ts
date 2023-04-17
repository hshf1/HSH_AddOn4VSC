import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, StatusBarItem
} from 'vscode'     /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { homedir } from 'os'    /** Importiert die homedir Funktion aus dem Node.js Modul.  Die homedir-Funktion gibt das Heimatverzeichnis des aktuellen Benutzers als Zeichenfolge zurück. */ */
import { exec } from 'child_process'    /** Importiert die exec Funktion aus dem Node.js Modul. Die exec-Funktion wird verwendet, um einen Befehl in der Befehlszeile auszuführen. */

import { activityBarMain } from './activity_bar'    /** Importiert die Funktion die in der Activitybar die Links einfügt */
import { openprefolder } from './checkfolder'		/** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkjsons } from './jsonfilescheck'		/** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { constcommands } from './constants'         /** Importiert die Namen und Beschreibungen der Commands aus constants.ts*/

const userhomefolder = homedir()    /** Speichert das Heimatvereichnis des Benutzers */

let IS_WINDOWS: boolean, IS_OSX: boolean, IS_LINUX: boolean /** Definiert Bool's für die einzelnen Betriebssysteme */
let statusbar_button: StatusBarItem /** Definiert statusbar_button als StatusBarItem */
/** let gcc_command: string // is it still needed? */
let folderPath_C_Uebung: string, filePath_settingsjson: string, filePath_tasksjson: string /** Definiert eine Reihe von String-Vaariablen */
let filesencoding_settingsjson: string, compilerpath: string, filePath_testprog: string /** Definiert eine Reihe von String-Vaariablen */
let setting_init: boolean | undefined = undefined   /** Boolean die zurück gibt ob, initMain erfolgreich war */
let hshRZ: boolean | undefined = undefined  /** Boolean die angibt ob es sich um einen PC im Rechnerraum handelt*/
let compiler_stat: boolean = false  /** Boolean die angibt ob Compiler initialisiert wurde und keinen Fehler ausgibt */

export function initMain() {    /** Hauptfunktion die die Initialisierung durchführt und wenn erfolgreich setting_init true setzt. */
    setOS() /** Setzt die entsprechende Boolean für das jeweilige Betriebssystem true */

    if (!getOS('WIN')) { /** "Wenn die Boolean IS_Windows false ist */
        if (!extensions.getExtension('vadimcn.vscode-lldb')) { /** Wenn "vadimcn.vscode-lldb" nicht installiert ist */
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb') /** Installiere "vadimcn.vscode-lldb" */
        }   /** "vadimcn.vscode-lldb" ist eine Erweiterung, die für den Debbuger wichtig ist. */
    }

    while (hshRZ === undefined) { /** Überprüft ob Rechnerraum oder nicht */
        hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
    }

    setPath()       /** Setzt die Pfade für .jsons und Übungsordner */
    checkjsons()    /** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */
    
    if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
		openprefolder()
	}

    setStatusBarItem()  /** Initialisiert den Button in der Statusleiste */
    activityBarMain()   /** Ruft Funktion auf die für die Activitybar zuständig ist */
    
    if (!compiler_stat) { /** Überprüft ob Compiler schon initialisiert wurde, falls nicht wird Compiler initialisiert */
        compiler_init()
    }

    setting_init = true /** Setzt true um zu zeigen, dass initMain abgeschlossen ist */
}

function setOS() { /** Funktion die Überprüft welches Betriebssystem vorliegt, und entsprechnd die Boolean setzt */
    IS_WINDOWS = process.platform.startsWith('win')
    IS_OSX = process.platform == 'darwin'
    IS_LINUX = !IS_WINDOWS && !IS_OSX
}

export function getOS(os: string) { /** Funktion die  WIN, MAC oder LIN als Eingabe bekommnt und entsprechend den Boolschen Status zurückgibt */
    switch(os) {
        case 'WIN':
            return IS_WINDOWS
        case 'MAC':
            return IS_OSX
        case 'LIN':
            return IS_LINUX
        default:
            return false
    }
}

function setStatusBarItem() { /** Funktion die den Button in der Statusbar definiert */
    statusbar_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    statusbar_button.text = 'HSH_AddOn4VSC pausieren'
    statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
    statusbar_button.command = 'extension.off'
    statusbar_button.show()
}

export function getStatusBarItem() { /** Funktion die statusbar_button Variable zurückgibt und somit global verfügbar macht */
    return statusbar_button 
}

export function getHsHRZ() {    /** Funktion die hshRZ Variable zurückgibt und somit global verfügbar macht */
    return hshRZ
}

export function getSettingInit() {  /** Funktion die setting_init Variable zurückgibt und somit global verfügbar macht */
    return setting_init
}

export function getPath(temp: string) {     /** Funktion die die Pfade zurückgibt und somit global verfügbar macht */
    switch(temp) {
        case 'settingsjson':
            return filePath_settingsjson
        case 'tasksjson':
            return filePath_tasksjson
        case 'testprog':
            return filePath_testprog
        case 'CUebung':
            return folderPath_C_Uebung
        default:
            return ''
    }
}

export function setPath() { /** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
    compilerpath = hshRZ ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
    /** Je nach dem ob im Rechneraum oder nicht wird der enstprechende Compiler-Pfad gespeichert */
    filesencoding_settingsjson = IS_WINDOWS ? `cp437` : `utf8`
    /** Je nach dem ob Windows oder nicht wird Codierung gespeichert*/

    if (IS_WINDOWS && !hshRZ) { /** Wenn windows und privater Rechner */
        folderPath_C_Uebung = `${userhomefolder}\\Documents\\C_Uebung`
        filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
        /** gcc_command = 'C:\\ProgramData\\chocolatey\\bin\\gcc.exe' */
    } else if (IS_WINDOWS && hshRZ) { /** Wenn windows und HSH Rechner */
        folderPath_C_Uebung = `U:\\C_Uebung`
        filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
        /** gcc_command = '' */
    } else if (IS_OSX) { /** Wenn MAC */
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/Library/Application Support/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/Library/Application Support/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        /** gcc_command = '/usr/bin/gcc' */
    } else if (IS_LINUX) { /** Wenn Linux */
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/.config/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/.config/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        /** gcc_command = '/usr/bin/gcc' */
    } else {
        window.showErrorMessage(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt. Bitte neu starten!`) /** Falls kein Betriebssystem gefunden worde */
    }
}

export function compiler_init() { /** Globale Funktion die den Compiler installiert */
    exec('gcc --version', (error, stdout) => { /** Prüft ob eine gcc version installiert ist */
        if (error) { /** Wenn Fehler auftritt (keine Version installiert ist) */
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => { /** Erzeugt neues Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
                if (IS_WINDOWS) {
                    window.showInformationMessage(`Compiler nicht gefunden. Zum installieren bitte auswählen:`, 'Privater Windows-Rechner', 'HsH Windows-Rechner', 'Jetzt nicht').then(async selected => { /** Fragt ob HSH oder Privater Rechner und wartet auf Antwort */
                        if (selected === 'Privater Windows-Rechner') { /** Wenn Privater Rechner */
                            workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable false */
                            changeHsHOrPrivate(false) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                            /** Führt den Befehl aus das Skript zur installation auszuführen */
                        } else if (selected === 'HsH Windows-Rechner') { /** wenn HSH Rechner */
                            workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global) /** Setzt in Settings.json die computerraum Variable true */
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx Path \"%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\"\n' })
                            compilerpath = 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' /** Setzt den Compilerpfad */
                            changeHsHOrPrivate(true) /** Ruft Funktion auf die die Einstellung ob HSH oder Privater Rechner einstellt */
                            await new Promise(resolve => setTimeout(resolve, 5000)) /** Wartet 5 Sekunden */
                            commands.executeCommand('workbench.action.reloadWindow') /** Lädt alle VS-Code Fenster neu, wodurch neue Änderungen aktiv werden*/
                        }
                    })
                } else if (IS_OSX) { /** wenn Mac, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                } else if (IS_LINUX) { /** wenn Linux, führt Skript zur installation aus */
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                }
            })
        } else {
            if (compiler_stat) { /** Falls compiler_stat schon true */
                window.showInformationMessage(`Compiler bereits installiert! Informationen zum Compiler: ${stdout}`)
            } else { /** Falls compiler_stat noch false, wird dann auf true gesetzt */
                compiler_stat = true
            }
        }
    })
}

export async function setRZHsH() { /** Globale asynchrone Funktion die Ändert ob es sich um privaten oder HSH Rechner handelt */
    if (!IS_WINDOWS) { /** Überprüft ob es sich um einen Windows PC handelt */
        window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
        return
    } else {
        if (workspace.getConfiguration('addon4vsc').get('computerraum')) { /** Überprüft ob die Einstellung computerraum in settings.json true ist */
            window.showInformationMessage('Auf privater Windows-Rechner gestellt.') 
        } else {
            window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.')
        }
        workspace.getConfiguration('addon4vsc').update('computerraum', !workspace.getConfiguration('addon4vsc').get('computerraum'), ConfigurationTarget.Global) /** Invertiert die Einstellung in settings.json Computerraum */
        compilerpath = workspace.getConfiguration('addon4vsc').get('computerraum') ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
        /** Speichert den neuen Compilerpfad ein */
        changeHsHOrPrivate(!hshRZ) /** Ruft Funktion auf die die Boolean ändert die für privat oder HSH Rechner steht */
    }
}

export function sethshRZ(ext_hshRZ: boolean) { /** Globale Funktion die die hshRZ Boolean überschreibt*/
    hshRZ = ext_hshRZ
}

export function getCompilerPath() { /** Globale Funktion die den Compilerpfad zurückgibt */
    return compilerpath
}

export function getFilesEncoding() {    /** Globale Funktion die zurückgbit um welche Art der Codierung es sich handelt */
    return filesencoding_settingsjson
}

export async function changeHsHOrPrivate(temp_hshRZ: boolean) { /** Funktion die die Einstellung der Boolean anwendet und den Compiler-Pfad + task.json aktualisiert  */
    sethshRZ(temp_hshRZ)
    setPath()   /** Setzt Compilerpfad neu */
    await commands.executeCommand(constcommands[3].command)   /** Führt command 3 aus, "tasks.json zurücksetzen" */                        
}

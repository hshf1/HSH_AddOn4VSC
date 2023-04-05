import {
    extensions, commands, window, StatusBarAlignment,
    Uri, workspace, ConfigurationTarget, StatusBarItem
} from 'vscode'
import { homedir } from 'os'
import { exec } from 'child_process'

import { renewjsons } from './jsonfilescheck'
import { build_activity_bar } from './activity_bar'
import { openprefolder } from './checkfolder'		/** Importiert die Funktion zum öffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkjsons } from './jsonfilescheck'		/** Importiert die Funktion zum überprüfen der jsons-Datei aus jsonfilescheck.ts */
import { constcommands } from './constants'

const userhomefolder = homedir()

let IS_WINDOWS: boolean, IS_OSX: boolean, IS_LINUX: boolean
let statusbar_button: StatusBarItem
/** let gcc_command: string // is it still needed? */
let folderPath_C_Uebung: string, filePath_settingsjson: string, filePath_tasksjson: string
let filesencoding_settingsjson: string, compilerpath: string, filePath_testprog: string
let setting_init: boolean | undefined = undefined
let hshRZ: boolean | undefined = undefined
let compiler_stat: boolean = false

export function initMain() {
    setOS()

    if (!getOS('WIN')) {
        if (!extensions.getExtension('vadimcn.vscode-lldb')) {
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
        }
    }

    while (hshRZ === undefined) {
        hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
    }

    setPath()
    checkjsons()									/** Ruft die Funktion auf, die sicherstellt, dass die Konfigurationsdateien vorhanden sind */
    
    if (!(workspace.workspaceFolders?.toString)) {  /** Funktion die schaut, ob Ordner in VS-Code geöffnet ist und ggf. den vorgefertigten Ordner öffnet */
		openprefolder()
	}

    setStatusBarItem()
    build_activity_bar()
    
    if (!compiler_stat) {
        compiler_init()
    }

    setting_init = true
}

function setOS() {
    IS_WINDOWS = process.platform.startsWith('win')
    IS_OSX = process.platform == 'darwin'
    IS_LINUX = !IS_WINDOWS && !IS_OSX
}

export function getOS(os: string) {
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

function setStatusBarItem() {
    statusbar_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    statusbar_button.text = 'HSH_AddOn4VSC pausieren'
    statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
    statusbar_button.command = 'extension.off'
    statusbar_button.show()
}

export function getStatusBarItem() {
    return statusbar_button
}

export function getHsHRZ() {
    return hshRZ
}

export function getSettingInit() {
    return setting_init
}

export function getPath(temp: string) {
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

export function setPath() {
    compilerpath = hshRZ ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
    filesencoding_settingsjson = IS_WINDOWS ? `cp437` : `utf8`
    
    if (IS_WINDOWS && !hshRZ) {
        folderPath_C_Uebung = `${userhomefolder}\\Documents\\C_Uebung`
        filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
        /** gcc_command = 'C:\\ProgramData\\chocolatey\\bin\\gcc.exe' */
    } else if (IS_WINDOWS && hshRZ) {
        folderPath_C_Uebung = `U:\\C_Uebung`
        filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
        /** gcc_command = '' */
    } else if (IS_OSX) {
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/Library/Application Support/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/Library/Application Support/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        /** gcc_command = '/usr/bin/gcc' */
    } else if (IS_LINUX) {
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/.config/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/.config/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        /** gcc_command = '/usr/bin/gcc' */
    } else {
        window.showErrorMessage(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt. Bitte neu starten!`)
    }
}

export function compiler_init() {
    exec('gcc --version', (error, stdout) => {
        if (error) {
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                if (IS_WINDOWS) {
                    window.showInformationMessage(`Compiler nicht gefunden. Zum installieren bitte auswählen:`, 'Privater Windows-Rechner', 'HsH Windows-Rechner', 'Jetzt nicht').then(async selected => {
                        if (selected === 'Privater Windows-Rechner') {
                            workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global)
                            changeHsHOrPrivate(false)
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                        } else if (selected === 'HsH Windows-Rechner') {
                            workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global)
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx Path \"%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\"\n' })
                            compilerpath = 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe'
                            changeHsHOrPrivate(true)
                            await new Promise(resolve => setTimeout(resolve, 5000))
                            commands.executeCommand('workbench.action.reloadWindow')
                        }
                    })
                } else if (IS_OSX) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/tree/master/script/vsclinuxosx.sh | bash\n' })
                } else if (IS_LINUX) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/tree/master/script/vsclinuxosx.sh | bash\n' })
                }
            })
        } else {
            if (compiler_stat) {
                window.showInformationMessage(`Compiler bereits installiert! Informationen zum Compiler: ${stdout}`)
            } else {
                compiler_stat = true
            }
        }
    })
}

export async function setRZHsH() {
    if (!IS_WINDOWS) {
        window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
        return
    } else {
        if (workspace.getConfiguration('addon4vsc').get('computerraum')) {
            window.showInformationMessage('Auf privater Windows-Rechner gestellt.')
        } else {
            window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.')
        }
        workspace.getConfiguration('addon4vsc').update('computerraum', !workspace.getConfiguration('addon4vsc').get('computerraum'), ConfigurationTarget.Global)
        compilerpath = workspace.getConfiguration('addon4vsc').get('computerraum') ? 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' : 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe'
        sethshRZ(!hshRZ)
        renewjsons(filePath_tasksjson)
        await new Promise(resolve => setTimeout(resolve, 5000))
        commands.executeCommand('workbench.action.reloadWindow')
    }
}

export function sethshRZ(ext_hshRZ: boolean) {
    hshRZ = ext_hshRZ
}

export function getCompilerPath() {
    return compilerpath
}

export function getFilesEncoding() {
    return filesencoding_settingsjson
}

export function changeHsHOrPrivate(temp_hshRZ: boolean) {
    sethshRZ(temp_hshRZ)
    setPath()
    commands.executeCommand(constcommands[3].command)   /** Führt command 3 aus, "tasks.json zurücksetzen" */                        
}
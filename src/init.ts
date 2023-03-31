import { extensions, commands, window, StatusBarAlignment, Uri, workspace, ConfigurationTarget } from 'vscode'
import { homedir } from 'os'
import { exec } from 'child_process'

import { checkjsons, renewjsons } from './jsonfilescheck'

export const IS_WINDOWS = process.platform.startsWith('win')
const IS_OSX = process.platform == 'darwin'
const IS_LINUX = !IS_WINDOWS && !IS_OSX
const userhomefolder = homedir()

let compiler_stat: boolean = false
let gcc_command: string // is it still needed?
export let setting_init: boolean | undefined = undefined
export let folderPath_C_Uebung: string
export let filePath_settingsjson: string
export let filePath_tasksjson: string
export let filePath_testprog: string
export let filesencoding_settingsjson: string
export let hshRZ: boolean | undefined = undefined
export let compilerpath: string

while (hshRZ === undefined) {
    hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
}

if (!IS_WINDOWS) {
    if (!extensions.getExtension('vadimcn.vscode-lldb')) {
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
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
        gcc_command = 'C:\\ProgramData\\chocolatey\\bin\\gcc.exe'
    } else if (IS_WINDOWS && hshRZ) {
        folderPath_C_Uebung = `U:\\C_Uebung`
        filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
        filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
        gcc_command = ''
    } else if (IS_OSX) {
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/Library/Application Support/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/Library/Application Support/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        gcc_command = '/usr/bin/gcc'
    } else if (IS_LINUX) {
        folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
        filePath_settingsjson = `${userhomefolder}/.config/Code/User/settings.json`
        filePath_tasksjson = `${userhomefolder}/.config/Code/User/tasks.json`
        filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
        gcc_command = '/usr/bin/gcc'
    } else {
        window.showErrorMessage(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt. Bitte neu starten!`)
    }
}

setPath()

export const statusbar_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
statusbar_button.text = 'HSH_AddOn4VSC pausieren'
statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
statusbar_button.command = 'extension.off'
statusbar_button.show()

if (!compiler_stat) {
    compiler_init()
}

export function compiler_init() {
    exec('gcc --version', (error, stdout) => {
        if (error) {
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                if (IS_WINDOWS) {
                    window.showInformationMessage(`Compiler nicht gefunden. Zum installieren bitte auswählen:`, 'Privater Windows-Rechner', 'HsH Windows-Rechner', 'Jetzt nicht').then(async selected => {
                        if (selected === 'Privater Windows-Rechner') {
                            workspace.getConfiguration('addon4vsc').update('computerraum', false, ConfigurationTarget.Global)
                            sethshRZ(false)
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                        } else if (selected === 'HsH Windows-Rechner') {
                            workspace.getConfiguration('addon4vsc').update('computerraum', true, ConfigurationTarget.Global)
                            // after IT got the Environmentvariable done for all, unnecessary
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx Path \"%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\"\n' })
                            compilerpath = 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe'
                            sethshRZ(true)
                            renewjsons(filePath_tasksjson)
                            await new Promise(resolve => setTimeout(resolve, 5000))
                            commands.executeCommand('workbench.action.reloadWindow')
                        }
                    })
                } else if (IS_OSX) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash\n' })
                } else if (IS_LINUX) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash\n' })
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

setting_init = true
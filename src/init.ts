import { extensions, commands, window, StatusBarAlignment, Uri, workspace } from 'vscode'
import { homedir } from 'os'
import { exec } from 'child_process'
import { existsSync } from 'fs'

export const IS_WINDOWS = process.platform.startsWith('win')
const IS_OSX = process.platform == 'darwin'
const IS_LINUX = !IS_WINDOWS && !IS_OSX
const userhomefolder = homedir()

let compiler_stat: boolean = false
export let setting_init: boolean | undefined = undefined
export let folderPath_C_Uebung: string
export let filePath_settingsjson: string
export let filePath_tasksjson: string
export let filePath_testprog: string
export let filesencoding_settingsjson: string
let gcc_command: string

export const compilerpath: string = !existsSync('U:\\Systemordner') ? 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe' : 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe';

if (IS_WINDOWS && !existsSync('U:\\Systemordner')) {
    folderPath_C_Uebung = `${userhomefolder}\\Documents\\C_Uebung`
    filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
    filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
    filesencoding_settingsjson = 'cp437'
    gcc_command = 'C:\\ProgramData\\chocolatey\\bin\\gcc.exe'
} else if (IS_WINDOWS && existsSync('U:\\Systemordner')) {
    folderPath_C_Uebung = `U:\\C_Uebung`
    filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
    filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
    filesencoding_settingsjson = 'cp437'
    gcc_command = ''
} else if (IS_OSX) {
    folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
    filePath_settingsjson = `${userhomefolder}/Library/Application Support/Code/User/settings.json`
    filePath_tasksjson = `${userhomefolder}/Library/Application Support/Code/User/tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
    filesencoding_settingsjson = 'utf8'
    gcc_command = '/usr/bin/gcc'
    if (!extensions.getExtension('vadimcn.vscode-lldb')) {
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
    }
} else if (IS_LINUX) {
    folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
    filePath_settingsjson = `${userhomefolder}/.config/Code/User/settings.json`
    filePath_tasksjson = `${userhomefolder}/.config/Code/User/tasks.json`
    filePath_testprog = `$${folderPath_C_Uebung}/testprog.c`
    filesencoding_settingsjson = 'utf8'
    gcc_command = '/usr/bin/gcc'
    if (!extensions.getExtension('vadimcn.vscode-lldb')) {
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
    }
} else {
    window.showErrorMessage(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt.`)
}

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
            if (IS_WINDOWS) {
                window.showInformationMessage(`Compiler nicht gefunden. Zum installieren bitte auswählen:`, 'Privater Windows-Rechner', 'HsH Windows-Rechner', 'Jetzt nicht').then(selected => {
                    if (selected === 'Privater Windows-Rechner') {
                        commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vscwindows.cmd && %temp%\\vsc.cmd\'\" && taskkill /f /im Code.exe && code\n' })
                        })
                        workspace.getConfiguration('addon4vsc').update('computerraum', false)
                    } else if (selected === 'HsH Windows-Rechner') {
                        commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                            // after IT got the Environmentvariable done for all, unnecessary
                            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'setx Path \"%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\" && taskkill /f /im Code.exe && code\n' })
                        })
                        workspace.getConfiguration('addon4vsc').update('computerraum', true)
                    } else {
                        // Input not correctly, no button or not now button clicked
                    }
                })
            } else {
                commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                    if (IS_OSX) {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash && pkill -f "Visual Studio Code" && open -a "Visual Studio Code"\n' })
                    } else if (IS_LINUX) {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash && killall -9 code && code\n' })
                    }
                })
            }
        } else {
            if (compiler_stat) {
                window.showInformationMessage(`Compiler bereits installiert! Informationen zum Compiler: ${stdout}`)
            }
            if (!compiler_stat) {
                compiler_stat = true
            }
        }
    })
}

export async function setRZHsH() {
    if (!IS_WINDOWS) {
        window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
        return
    }

    if (workspace.getConfiguration('addon4vsc').get('computerraum')) {
        window.showInformationMessage('Derzeitige Einstellung des Standorts wird auf privater Windows-Rechner gestellt, VSCode wird in 5 Sekunden neu gestartet!')
    } else {
        window.showInformationMessage('Derzeitige Einstellung des Standorts wird auf HsH Windows-Rechner im Rechenzentrum gestellt, VSCode wird in 5 Sekunden neu gestartet!')
    }

    workspace.getConfiguration('addon4vsc').update('computerraum', !workspace.getConfiguration('addon4vsc').get('computerraum'))

    await new Promise(resolve => setTimeout(resolve, 5000))

    commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'taskkill /f /im Code.exe && code\n' })
    })
}

setting_init = true
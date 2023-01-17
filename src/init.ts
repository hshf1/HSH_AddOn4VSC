import { extensions, commands, window, workspace, StatusBarAlignment } from 'vscode'
import { homedir } from 'os'

export const IS_WINDOWS = process.platform.startsWith('win')
export const IS_OSX = process.platform == 'darwin'
export const IS_LINUX = !IS_WINDOWS && !IS_OSX
export const userhomefolder = homedir()

export let setting_init: boolean | undefined = undefined
export let folderPath_C_Uebung: string
export let filePath_settingsjson: string
export let filePath_tasksjson: string
export let filePath_testprog: string
export let filesencoding_settingsjson: string
export let gcc_command: string
const config = workspace.getConfiguration('addon4vsc')
export const computerraum_hsh = config.get('computerraum')

export const compilerpath: string = !computerraum_hsh ? 'C:\\\\ProgramData\\\\chocolatey\\\\bin\\\\gcc.exe' : 'C:\\\\Program Files (x86)\\\\Dev-Cpp\\\\MinGW64\\\\bin\\\\gcc.exe' ;

if (IS_WINDOWS && !computerraum_hsh) {
    folderPath_C_Uebung = `${userhomefolder}\\Documents\\C_Uebung`
    filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
    filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
    filesencoding_settingsjson = 'cp437'
    gcc_command = 'C:\\ProgramData\\chocolatey\\bin\\gcc.exe'
} else if (IS_WINDOWS && computerraum_hsh) {
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
statusbar_button.text = 'AddOn4VSC pausieren'
statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
statusbar_button.command = 'extension.off'
statusbar_button.show()

setting_init = true
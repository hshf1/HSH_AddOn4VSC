import { StatusBarAlignment, window, extensions, commands } from 'vscode'
import { dirname } from 'path'
import { error_message } from './output'

const IS_WINDOWS = process.platform.startsWith('win')
const IS_OSX = process.platform == 'darwin'
const IS_LINUX = !IS_WINDOWS && !IS_OSX

const userhomefolder = dirname(dirname(dirname(dirname(__dirname))))
export let folderPath_C_Uebung: string
export let filePath_settingsjson: string
export let filePath_tasksjson: string
export let filePath_testprog: string
export let filesencoding_settingsjson: string

if (IS_WINDOWS) {
    folderPath_C_Uebung = `${userhomefolder}\\Documents\\C_Uebung`
    filePath_settingsjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\settings.json`
    filePath_tasksjson = `${userhomefolder}\\AppData\\Roaming\\Code\\User\\tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}\\testprog.c`
    filesencoding_settingsjson = 'cp437'
} else if (IS_OSX) {
    folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
    filePath_settingsjson = `${userhomefolder}/Library/Application Support/Code/User/settings.json`
    filePath_tasksjson = `${userhomefolder}/Library/Application Support/Code/User/tasks.json`
    filePath_testprog = `${folderPath_C_Uebung}/testprog.c`
    filesencoding_settingsjson = 'utf8'
    if (!extensions.getExtension('vadimcn.vscode-lldb')) {
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
    }
} else if (IS_LINUX) {
    folderPath_C_Uebung = `${userhomefolder}/Documents/C_Uebung`
    filePath_settingsjson = `${userhomefolder}/.config/Code/User/settings.json`
    filePath_tasksjson = `${userhomefolder}/.config/Code/User/tasks.json`
    filePath_testprog = `$${folderPath_C_Uebung}/testprog.c`
    filesencoding_settingsjson = 'utf8'
    if (!extensions.getExtension('vadimcn.vscode-lldb')) {
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
    }
} else {
    error_message(`Betriebssystem wurde nicht erkannt! Einige Funktionen werden nicht richtig ausgeführt.`)
}

export const menue_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
menue_button.text = 'VorlesungC-Menü'
menue_button.tooltip = 'Klicken, um zum Menü zu gelangen'
menue_button.command = 'menue.show'
menue_button.show()

export const testprogc = `#include <stdio.h>

int main() {
    int x = 1;
    x++;

    printf("Erinnerung: Datei- und Verzeichnisname dürfen keine Umlaute oder Leerzeichen haben!\\n");
    printf("Das Ergebnis von x lautet: %d\\n",x);
}`
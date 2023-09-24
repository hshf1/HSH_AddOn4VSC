import { extensions, commands, window, StatusBarAlignment, workspace, ConfigurationTarget, StatusBarItem } from 'vscode';
import { exec } from 'child_process';
import { existsSync } from 'fs';

import { initActivityBar } from '../activity_bar';
import { openPreFolder } from '../checkfolder';
import { initLogFile, writeLog } from '../logfile';
import { checkPaths, initPath } from './paths';
import { getOSBoolean, setOS } from './os';
import { checkSettingsFile } from '../json/settings';
import { checkTasksFile } from '../json/tasks';
import { initExtensionsDir } from '../extensionPath';
import { initCompiler } from '../compiler/initCompiler';
import { OS, ProgLang } from '../enum';

let settings = {
    computerraum: false, progLanguage: ProgLang[ProgLang.C], compiler: false, reloadNeeded: false,
    statusBarButton: window.createStatusBarItem(StatusBarAlignment.Right, 0)
};

export function initExtension(): void {
    writeLog(`Initialisierung beginnt!`, 'INFO');
    setOS();

    if (getOSBoolean(OS.Windows)) {
        initWinLocation();
    }

    initProgLang();
    initPath();
    initLogFile();

    if ((getOSBoolean(OS.MacOS) || getOSBoolean(OS.Linux)) && !extensions.getExtension('vadimcn.vscode-lldb')) {
        writeLog(`vadimcn.vscode-lldb wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb');
    }

    if (getProgLanguageBoolean(ProgLang.Java) && !extensions.getExtension('vscjava.vscode-java-pack')) {
        writeLog(`vscjava.vscode-java-pack wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'vscjava.vscode-java-pack');
    }

    if (getProgLanguageBoolean(ProgLang.Python) && !extensions.getExtension('ms-python.python')) {
        writeLog(`ms-python.python wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'ms-python.python');
    }

    checkSettingsFile();
    checkTasksFile();
    initActivityBar();
    initStatusBarItem();
    checkPaths();
    initCompiler();

    if (!(workspace.workspaceFolders?.toString)) {
        openPreFolder();
    }

    writeLog(`Initialisierung beendet!`, 'INFO');
}

function initWinLocation(): void {
    exec('whoami', (error, stdout, stderr) => {
        if (error) {
            writeLog(`Error: ${error.message}`, 'ERROR');
            return;
        }

        const username = stdout.trim();

        writeLog(`Username: ${username}`, 'INFO');

        if ((username.startsWith('fh-h/') || username.startsWith('fh-h\\') && existsSync(`U:\\Systemordner`))) {
            settings.computerraum = true;
        } else {
            settings.computerraum = false;
        }
    });

    writeLog(`Location: ${settings.computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO');
}

export function initProgLang(): void {
    try {
        settings.progLanguage = workspace.getConfiguration('addon4vsc').get('sprache', ProgLang[ProgLang.C]);
        writeLog(`Initialisierte Programmiersprache: ${settings.progLanguage}`, 'INFO');
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
    }
}

export function setComputerraumConfig(tmp: boolean) {
    const oldConfig = getComputerraumConfig()
    settings.computerraum = tmp
    if (oldConfig !== tmp) {
        initPath()
        initExtensionsDir()
        initCompiler()
    }
}

export function getComputerraumConfig() {
    return settings.computerraum
}

export function setProgLanguageConfig(tmp: string) {
    try {
        workspace.getConfiguration('addon4vsc').update('sprache', tmp, ConfigurationTarget.Global)
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

export function getProgLanguageString(): string {
    return settings.progLanguage;
}

export function getProgLanguageBoolean(tmp: ProgLang): boolean {
    return settings.progLanguage === ProgLang[tmp];
}

async function initStatusBarItem(): Promise<void> {
    settings.statusBarButton.text = '$(info) HSH_AddOn4VSC pausieren';
    settings.statusBarButton.tooltip = 'Klicken, um die Erweiterung HsH_AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)';
    settings.statusBarButton.command = 'extension.off';
    settings.statusBarButton.color = "red";
    settings.statusBarButton.show();
}

export function getStatusBarItem(): StatusBarItem {
    return settings.statusBarButton;
}

export function restartVSC() {
    window.showWarningMessage(writeLog(`VSCode wird jetzt beendet, bitte VSCode manuell neu starten!`, 'WARNING'), { modal: true }, 'OK')
        .then(() => {
            exec('taskkill /im code.exe /f', (error, stdout, stderr) => {
                if (error) {
                    writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
                }
            })
        })
}
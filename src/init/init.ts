import { extensions, commands, window, workspace, ProgressLocation } from 'vscode';
import { exec, execSync } from 'child_process';
import { existsSync } from 'fs';

import { initActivityBar } from '../activity_bar';
import { openPreFolder } from '../checkfolder';
import { initLogFile, writeLog } from '../logfile';
import { checkPaths, initPath } from './paths';
import { getOSBoolean, setOS } from './os';
import { checkSettingsFile } from '../json/settings';
import { checkTasksFile } from '../json/tasks';
import { initExtensionsDir } from '../extensionPath';
import { OS, ProgLang } from './enum';
import { getProgLanguageBoolean, getProgLanguageString, initLanguage } from './language';
import { installC } from '../compiler/c';
import { installJava } from '../compiler/java';
import { installPython } from '../compiler/python';

let settings = {
    computerraum: false, progLanguage: ProgLang.c, init: false, reloadNeeded: false
};

export function initExtension(): void {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Initialisierung...',
        cancellable: false,
    }, async () => {
        writeLog(`Initialisierung beginnt!`, 'INFO');
        setOS();
        initLanguage();
        initPath();
        if (!(workspace.workspaceFolders?.toString)) {
            openPreFolder();
        }
        initLogFile();
        checkMissingExtension();
        initActivityBar();
        checkSettingsFile();
        checkTasksFile();
        checkPaths();
        initCompiler();
    }).then(() => {
        settings.init = true;
        writeLog(`Initialisierung beendet!`, 'INFO');
    });
}

export function initWinLocation(): void {
    try {
        const username = execSync(`whoami`).toString().trim();

        writeLog(`Username: ${username}`, 'INFO');

        if (username.startsWith('fh-h/') || username.startsWith('fh-h\\') || existsSync(`U:\\Systemordner`)) {
            settings.computerraum = true;
        } else {
            settings.computerraum = false;
        }
    } catch (error) {
        writeLog(`Error: ${error}`, 'ERROR');
    } finally {
        writeLog(`Location: ${settings.computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO');
    }
}

export function setComputerraumConfig(tmp: boolean) {
    const oldConfig = getComputerraumConfig();
    settings.computerraum = tmp;
    if (oldConfig !== tmp) {
        initPath();
        initExtensionsDir();
        initCompiler();
    }
}

export function getComputerraumConfig() {
    return settings.computerraum;
}

export function getSettingsInit() {
    return settings.init;
}

export function restartVSC() {
    window.showWarningMessage(`VSCode wird jetzt beendet, bitte VSCode manuell neu starten!`, { modal: true }, 'OK')
        .then(() => {
            exec('taskkill /im code.exe /f', (error, stdout, stderr) => {
                if (error) {
                    writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
                }
            });
        });
}

export function initCompiler() {
    switch (getProgLanguageString()) {
        case ProgLang.c:
            installC();
            break;
        case ProgLang.java:
            installJava();
            break;
        case ProgLang.python:
            installPython();
            break;
        default:
            return;
    }
}

function checkMissingExtension() {
    if (!extensions.getExtension('formulahendry.code-runner')) {
        writeLog(`formulahendry.code-runner wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'formulahendry.code-runner');
    }

    if (!extensions.getExtension('ms-vsliveshare.vsliveshare')) {
        writeLog(`ms-vsliveshare.vsliveshare wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'ms-vsliveshare.vsliveshare');
    }

    if (!extensions.getExtension('ms-vscode.cpptools')) {
        writeLog(`ms-vscode.cpptools wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'ms-vscode.cpptools');
    }

    if ((getOSBoolean(OS.macOS) || getOSBoolean(OS.linux)) && !extensions.getExtension('vadimcn.vscode-lldb')) {
        writeLog(`vadimcn.vscode-lldb wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb');
    }

    if (getProgLanguageBoolean(ProgLang.java) && !extensions.getExtension('vscjava.vscode-java-pack')) {
        writeLog(`vscjava.vscode-java-pack wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'vscjava.vscode-java-pack');
    }

    if (getProgLanguageBoolean(ProgLang.python) && !extensions.getExtension('ms-python.python')) {
        writeLog(`ms-python.python wird nachinstalliert`, 'INFO');
        commands.executeCommand('workbench.extensions.installExtension', 'ms-python.python');
    }
}
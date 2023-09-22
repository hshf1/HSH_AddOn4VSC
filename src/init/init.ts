import { extensions, commands, window, StatusBarAlignment, Uri, workspace, ConfigurationTarget, ProgressLocation } from 'vscode';
import { exec } from 'child_process';
import { existsSync } from 'fs';
import * as fs from 'fs-extra';
import { join } from 'path';

import { initActivityBar } from '../activity_bar';
import { openPreFolder } from '../checkfolder';
import { initLogFile, writeLog } from '../logfile';
import { getPath, initPath } from './paths';
import { getOSBoolean, setOS } from './os';
import { checkSettingsFile } from '../json/settings';
import { checkTasksFile } from '../json/tasks';

let settings = {
    computerraum: false, progLanguage: "C", compiler: false, reloadNeeded: false, initExtensionsDirRunning: false,
    statusBarButton: window.createStatusBarItem(StatusBarAlignment.Right, 100)
};

export function initExtension(): void {
    window.withProgress({
        location: ProgressLocation.Notification, title: 'Initialisiere HsH_AddOn4VSC...', cancellable: false
    }, async (progress, token) => {
        writeLog(`Initialisierung beginnt!`, 'INFO');
        setOS();

        if ((getOSBoolean('macos') || getOSBoolean('linux')) && !extensions.getExtension('vadimcn.vscode-lldb')) {
            writeLog(`VSCode-lldb wird nachinstalliert`, 'INFO');
            commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb');
        }

        if (getOSBoolean('windows')) {
            initWinLocation();
        }

        initProgLang();
        initPath();
        initLogFile();
        checkSettingsFile();
        checkTasksFile();
        initStatusBarItem();
        initActivityBar();
        initCompiler() //TODO: Funktion verbessern/prüfen

        if (!(workspace.workspaceFolders?.toString)) {
            openPreFolder()
        }

        writeLog(`Initialisierung beendet!`, 'INFO');
    })
}

function initWinLocation(): void {
    if (existsSync(`U:\\Systemordner`) || existsSync(`C:\\Program Files\\mingw64\\bin`)) { //TODO: Verbessern der Erkennung
        settings.computerraum = true;
    } else {
        settings.computerraum = false;
    }

    writeLog(`Location: ${settings.computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO');
}

export function initProgLang(): void {
    try {
        settings.progLanguage = workspace.getConfiguration('addon4vsc').get('sprache', 'C');
        writeLog(`Gewählte Programmiersprache: ${settings.progLanguage}`, 'INFO');
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

export function getProgLanguageConfig() {
    return settings.progLanguage
}

async function initStatusBarItem(): Promise<void> {
    settings.statusBarButton.text = 'HSH_AddOn4VSC pausieren';
    settings.statusBarButton.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)';
    settings.statusBarButton.command = 'extension.off';
    settings.statusBarButton.show();
}

export function getStatusBarItem() {
    return settings.statusBarButton
}

export async function initCompiler() {
    if (getOSBoolean('Windows')) {
        await initExtensionsDir()
        await deleteOldPath('C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin')
        if (getComputerraumConfig()) {
            await addNewPath('C:\\Program Files\\mingw64\\bin')
        } else {
            await addNewPath('C:\\ProgramData\\chocolatey\\bin')
            await addNewPath('C:\\ProgramData\\chocolatey\\lib\\mingw\\tools\\install\\mingw64\\bin')
        }
    }

    exec('gcc --version', (error, stdout) => {
        if (error) {
            commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(getPath().userHome)).then(async () => {
                if (getOSBoolean('Windows')) {
                    if (settings.computerraum) {
                        await addNewPath('C:\\Program Files\\mingw64\\bin')
                    } else {
                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                    }
                } else if (getOSBoolean('MacOS')) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                } else if (getOSBoolean('Linux')) {
                    commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
                }
            })
        } else {
            writeLog(`Compiler gefunden! Informationen zum Compiler: ${stdout.trim()} `, 'INFO')
            if (settings.compiler) {
                window.showInformationMessage(`Compiler bereits installiert!`)
            } else {
                settings.compiler = true
            }
        }
    })

    //FIXME Funktion wird zu früh aufgerufen, Variable wurde noch nicht gesetzt Zeile 205
    if ((settings.reloadNeeded && getOSBoolean('Windows'))) {
        restartVSC()
    }
}

async function deleteOldPath(tmp: string) {
    const pathToRemove: string = tmp
    let pathVar = await getUserEnvironmentPath()
    const pathDirs = pathVar.split(';')
    const index = pathDirs.indexOf(pathToRemove)
    if (index !== -1) {
        pathDirs.splice(index, 1)
        pathVar = pathDirs.join(';')
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR')
            } else {
                writeLog(`Alte Umgebungsvariable erfolgreich entfernt: ${stdout.trim()}`, 'INFO')
                settings.reloadNeeded = true
            }
        })
    } else {
        writeLog(`Alte Umgebungsvariable ist bereits gelöscht.`, 'INFO')
    }
}

async function addNewPath(tmp: string) {
    const pathToAdd: string = tmp
    let pathVar = await getUserEnvironmentPath()
    const pathDirs = pathVar.split(';')
    if (!pathDirs.includes(pathToAdd)) {
        pathDirs.push(pathToAdd)
        pathVar = pathDirs.join(';')
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR')
            } else {
                writeLog(`Neue Umgebungsvariable (${pathToAdd}) erfolgreich hinzugefügt: ${stdout.trim()}`, 'INFO')
                settings.reloadNeeded = true
            }
        })
    } else {
        writeLog(`Umgebungsvariable ist bereits vorhanden.`, 'INFO')
    }
}

export function getUserEnvironmentPath(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('reg query HKCU\\Environment /v Path', (error, stdout) => {
            if (error) {
                reject(error)
            } else {
                const matches = stdout.match(/Path\s+REG_SZ\s+(.*)/)
                if (matches) {
                    resolve(matches[1])
                } else {
                    resolve('')
                }
            }
        })
    })
}

async function initExtensionsDir() {
    if (!settings.initExtensionsDirRunning) {
        settings.initExtensionsDirRunning = true
        const USERHOME = getPath().userHome
        const VSCUSERDATA = getPath().vscUserData

        const EXTENSIONSDIRPATH = `${USERHOME}\\.vscode\\extensions`
        const EXTENSIONSDIRPATH_HSH = join(VSCUSERDATA, 'VSCODE_Extensions')

        const CURRENTEXTENSIONPATH = await getUserExtensionDir()

        if (settings.computerraum) {
            if (CURRENTEXTENSIONPATH == EXTENSIONSDIRPATH_HSH) {
                writeLog(`Extensionpfad bereits gesetzt: ${EXTENSIONSDIRPATH_HSH}`, "INFO")
            } else {
                exec(`setx VSCODE_EXTENSIONS ${EXTENSIONSDIRPATH_HSH}`)
                writeLog(`Extensionspfad neu gesetzt: ${EXTENSIONSDIRPATH_HSH}`, 'INFO')
                copyExtensions(EXTENSIONSDIRPATH, EXTENSIONSDIRPATH_HSH)
            }
        } else if (!settings.computerraum && CURRENTEXTENSIONPATH != "%VSCODE_EXTENSIONS%") {
            exec(`setx VSCODE_EXTENSIONS ""`)
            writeLog(`Extensionspfad zurückgesetzt`, 'INFO')
        }
        settings.initExtensionsDirRunning = false
    }
}

export function getUserExtensionDir(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('echo %VSCODE_EXTENSIONS%', (error, stdout) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout.trim())
            }
        })
    })
}

function copyExtensions(sourcePath: string, destPath: string) {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Kopiere Extensions...',
        cancellable: false
    }, async (progress, token) => {
        try {
            await fs.ensureDir(destPath)
            writeLog(`Kopiervorgang der Extensions begonnen`, 'INFO')
            progress.report({ message: "Kopiervorgang...", increment: 50 })
            await fs.copy(sourcePath, destPath, {
                overwrite: true,
                errorOnExist: false,
            })
            writeLog(`Kopiervorgang der Extensions abgeschlossen`, 'INFO')
            progress.report({ message: "Kopiervorgang beendet", increment: 100 })
        } catch (err) {
            writeLog(`Fehler beim kopieren des Addons: ${err}`, 'ERROR')
            window.showErrorMessage("Bei dem Kopieren ist ein Fehler aufgetreten!")
        }
    }).then(() => {
        restartVSC()
    })
}

function restartVSC() {
    window.showWarningMessage(writeLog(`VSCode wird jetzt beendet, bitte VSCode manuell neu starten!`, 'WARNING'), { modal: true }, 'OK')
        .then(() => {
            exec('taskkill /im code.exe /f', (error, stdout, stderr) => {
                if (error) {
                    writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
                }
            })
        })
}
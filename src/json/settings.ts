import { copyFileSync, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { window, workspace } from "vscode";

import { getPath } from "../init/paths";
import { getOSBoolean } from "../init/os";
import { getComputerraumConfig } from "../init/init";
import { writeLog } from "../logfile";

export function checkSettingsFile(): void {
    const SETTINGSJSONPATH = join(getPath().vscUserData, 'settings.json');

    try {
        statSync(SETTINGSJSONPATH);
        writeLog(`${SETTINGSJSONPATH} wurde gefunden.`, 'INFO');
    } catch (error) {
        writeLog(`${SETTINGSJSONPATH} wurde nicht gefunden.`, 'WARNING');
        setSettingsFile();
    }
}

export function setSettingsFile(): void {
    const CONTENT = getSettingsContent();
    const PATH = join(getPath().vscUserData, 'settings.json');

    createSettingsBackup();

    try {
        writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' });
    } catch (err: any) {
        writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR');
    } finally {
        writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO');
    }
}

export function addMissingSettings(): void {
    const SETTINGSPATH: string = join(getPath().vscUserData, 'settings.json');
    createSettingsBackup();

    if (existsSync(SETTINGSPATH)) {
        const existingSettingsContent = readFileSync(SETTINGSPATH, 'utf8');
        const existingSettingsWithoutComments = existingSettingsContent.replace(/\/\/.*/g, '');
        let existingSettings: Record<string, any> = {};

        try {
            existingSettings = JSON.parse(existingSettingsWithoutComments);
        }
        catch (error) {
            writeLog(`${SETTINGSPATH} ist eine fehlerhafte JSON-Datei. Die Datei wird jetzt erneuert.`, 'ERROR');
            setSettingsFile();
            return;
        }

        function mergeObjects(target: any, source: any): void {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = source[key];
                    } else if (typeof source[key] === 'object' && source[key] !== null) {
                        mergeObjects(target[key], source[key]);
                    }
                }
            }
        }

        mergeObjects(existingSettings, getSettingsContent());

        writeFileSync(SETTINGSPATH, JSON.stringify(existingSettings, null, 4));
        writeLog(`Fehlende Einstellungen in der settings.json wurden hinzugefügt`, 'INFO');
    } else {
        setSettingsFile();
    }
}

export function openSettingsFile(): void {
    const SETTINGSPATH: string = join(getPath().vscUserData, 'settings.json');

    if (existsSync(SETTINGSPATH)) {
        workspace.openTextDocument(SETTINGSPATH)
            .then((document) => {
                window.showTextDocument(document);
            });
    } else {
        window.showErrorMessage('Keine alte settings.json gefunden!');
    }
}

export function openOldSettingsFile(): void {
    const OLDSETTINGSPATH: string = join(getPath().tempAddOn, 'old_settings.json');

    if (existsSync(OLDSETTINGSPATH)) {
        workspace.openTextDocument(OLDSETTINGSPATH)
            .then((document) => {
                window.showTextDocument(document);
            });
    } else {
        window.showErrorMessage('Keine alte settings.json gefunden!');
    }
}

function getSettingsContent() {
    const ENCODING = getOSBoolean('Windows') ? `cp437` : `utf8`;
    const AUTOUPDATE = getComputerraumConfig() ? `manual` : `default`;

    return {
        "addon4vsc.sprache": "C",
        "terminal.integrated.scrollback": 10000,
        "liveshare.anonymousGuestApproval": "accept",
        "liveshare.guestApprovalRequired": false,
        "extensions.ignoreRecommendations": true,
        "files.encoding": `${ENCODING}`,
        //"files.autoGuessEncoding": true,
        "editor.unicodeHighlight.nonBasicASCII": false,
        "files.autoSave": "onFocusChange",
        "code-runner.saveFileBeforeRun": true,
        "editor.bracketPairColorization.enabled": true,
        "editor.insertSpaces": true,
        "editor.tabSize": 4,
        "editor.renderWhitespace": "none",
        //"editor.renderWhitespace": "selection",
        "C_Cpp.debugShortcut": false,
        "code-runner.runInTerminal": true,
        "code-runner.preserveFocus": false,
        "code-runner.defaultLanguage": "C",
        "update.mode": `${AUTOUPDATE}`,
        "launch": {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "debuggen",
                    "type": "cppdbg",
                    "request": "launch",
                    "stopAtEntry": false,
                    "externalConsole": false,
                    // macos-spezifische Einstellungen
                    "osx": {
                        "type": "lldb",
                        "MIMode": "lldb",
                        "program": "\${fileDirname}/\${fileBasenameNoExtension}",
                        "cwd": "\${fileDirname}",
                        "preLaunchTask": "C/C++: gcc Aktive Datei kompilieren"
                    },
                    // windows-spezifische Einstellungen
                    "windows": {
                        "MIMode": "gdb",
                        "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
                        "cwd": "\${workspaceFolder}",
                        "preLaunchTask": "C/C++: gcc.exe Aktive Datei kompilieren"
                    },
                    // linux-spezifische Einstellungen
                    "linux": {
                        "MIMode": "lldb",
                        "program": "\${fileDirname}/\${fileBasenameNoExtension}",
                        "cwd": "\${fileDirname}",
                        "preLaunchTask": "C/C++: gcc Aktive Datei kompilieren"
                    }
                }
            ]
        }
    }
}

function createSettingsBackup(): void { // TODO: Backup nur ausführen, wenn was geändert wird in der JSON
    const SETTINGSPATH: string = join(getPath().vscUserData, 'settings.json');
    const OLDSETTINGSPATH: string = join(getPath().tempAddOn, 'old_settings.json');

    try {
        if (existsSync(SETTINGSPATH)) {
            if (existsSync(OLDSETTINGSPATH)) {
                unlinkSync(OLDSETTINGSPATH);
            }
            copyFileSync(SETTINGSPATH, OLDSETTINGSPATH);
        }
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
    }
}
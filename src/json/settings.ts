import { copyFileSync, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { window, workspace } from "vscode";

import { getPath } from "../init/paths";
import { getOSBoolean } from "../init/os";
import { OS } from "../init/enum";
import { errorNotification, infoNotification, warningNotification } from "../notifications";
import { getComputerraumConfig } from "../init/init";

export function checkSettingsFile(): void {
    const SETTINGSJSONPATH = join(getPath().vscUserData, 'settings.json');

    try {
        statSync(SETTINGSJSONPATH);
        infoNotification(`${SETTINGSJSONPATH} wurde gefunden.`);
    } catch (error) {
        warningNotification(`${SETTINGSJSONPATH} wurde nicht gefunden.`);
        setSettingsFile();
    }
}

export function setSettingsFile(): void {
    const CONTENT = getSettingsContent();
    const PATH = join(getPath().vscUserData, 'settings.json');

    createSettingsBackup();

    try {
        writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' });
        infoNotification(`${PATH} wurde erfolgreich erstellt.`, true);
    } catch (err: any) {
        errorNotification(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`);
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
            errorNotification(`${SETTINGSPATH} ist eine fehlerhafte JSON-Datei. Die Datei wird jetzt erneuert.`);
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
        infoNotification(`Fehlende Einstellungen in der settings.json wurden hinzugefügt`, true);
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
        errorNotification('Keine alte settings.json gefunden!', true);
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
        errorNotification('Keine alte settings.json gefunden!', true);
    }
}

function getSettingsContent() {
    const ENCODING = getOSBoolean(OS.windows) ? `cp437` : `utf8`;
    const launch = getOSBoolean(OS.windows) ? launchWindows : launchLinuxMacOs;
    const pythonName = getComputerraumConfig() ? `` : `python3 -u`;

    return {
        "addon4vsc.sprache": "C",
        "terminal.integrated.scrollback": 10000,
        "liveshare.anonymousGuestApproval": "accept",
        "liveshare.guestApprovalRequired": false,
        "extensions.ignoreRecommendations": true,
        "files.encoding": `${ENCODING}`,
        "editor.unicodeHighlight.nonBasicASCII": false,
        "files.autoSave": "onFocusChange",
        "code-runner.saveFileBeforeRun": true,
        "editor.bracketPairColorization.enabled": true,
        "editor.insertSpaces": true,
        "editor.tabSize": 4,
        "editor.renderWhitespace": "none",
        "C_Cpp.debugShortcut": false,
        "update.enableWindowsBackgroundUpdates": false,
        "code-runner.runInTerminal": true,
        "code-runner.preserveFocus": false,
        "code-runner.defaultLanguage": "C",
        "code-runner.executorMap": {
            "python": `${pythonName}`,
        },
        launch
    };
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
        errorNotification(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`);
    }
}

// TODO; envFile nutzen und hier schon die pfade mit angeben

const launchWindows = {
    "launch": {
        "version": "0.2.0",
        "configurations": [
            {
                "name": "C -> Aktive-Datei",
                "type": "cppdbg",
                "request": "launch",
                "stopAtEntry": false,
                "externalConsole": false,
                "MIMode": "gdb",
                "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
                "cwd": "\${workspaceFolder}",
                "preLaunchTask": "C/C++ Aktive Datei kompilieren"
            },
            {
                "name": "Python -> Aktive-Datei",
                "type": "python",
                "request": "launch",
                "program": "${file}",
                "console": "integratedTerminal",
                "justMyCode": true
            },
            {
                "type": "java",
                "name": "Java -> Aktive-Datei",
                "request": "launch",
                "mainClass": "${file}"
            }
        ]
    }
};

const launchLinuxMacOs = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C -> Aktive-Datei",
            "type": "lldb",
            "request": "launch",
            "MIMode": "gdb",
            "program": "\${fileDirname}/\${fileBasenameNoExtension}",
            "cwd": "\${fileDirname}",
            "preLaunchTask": "C/C++ Aktive Datei kompilieren"
        },
        {
            "name": "Python -> Aktive-Datei",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "type": "java",
            "name": "Java -> Aktive-Datei",
            "request": "launch",
            "mainClass": "${file}"
        }
    ]
};
import { copyFileSync, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { window, workspace } from "vscode";

import { getPath } from "../init/Paths";
import { getOSBoolean } from "../init/OS";
import { OS } from "../init/Init";
import { errorNotification, infoNotification, warningNotification } from "../functions/Notifications";

export function checkSettingsFile(): void {
    const SETTINGSJSONPATH = join(getPath().vscUserData, 'settings.json');

    try {
        statSync(SETTINGSJSONPATH);
        infoNotification(`${SETTINGSJSONPATH} wurde gefunden.`);
        //setSettingsOnce();
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
    const launch = getOSBoolean(OS.windows) ? launchWindows : getOSBoolean(OS.macOS) ? launchMac : launchLinux;
    const pythonName = getOSBoolean(OS.windows) ? `python -u` : `python3 -u`;

    const linuxLM = getOSBoolean(OS.linux) ? "cd $dir && gcc $fileName -o $fileNameWithoutExt -lm && $dir$fileNameWithoutExt" : "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt"

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
            "c": `${linuxLM}`
        },
        launch
    };
}

function createSettingsBackup(): void {
    // TODO: Backup nur ausführen, wenn was geändert wird in der JSON
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

// TODO: envFile nutzen und hier schon die pfade mit angeben, prüfen ob das überhaupt möglich ist

const launchWindows = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C -> Aktive-Datei debuggen",
            "type": "cppdbg",
            "request": "launch",
            "stopAtEntry": false,
            "externalConsole": false,
            "MIMode": "gdb",
            "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
            "cwd": "\${workspaceFolder}",
            "preLaunchTask": "C Aktive Datei kompilieren"
        },
        {
            "name": "C++ -> Aktive-Datei debuggen",
            "type": "cppdbg",
            "request": "launch",
            "stopAtEntry": false,
            "externalConsole": false,
            "MIMode": "gdb",
            "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
            "cwd": "\${workspaceFolder}",
            "preLaunchTask": "C++ Aktive Datei kompilieren"
        },
        {
            "name": "Python -> Aktive-Datei debuggen",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Java -> Aktive-Datei debuggen",
            "type": "java",
            "request": "launch",
            "mainClass": "${file}"
        }
    ]
};

const launchLinux = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C -> Aktive-Datei",
            "type": "lldb",
            "request": "launch",
            "MIMode": "gdb",
            "program": "\${fileDirname}/\${fileBasenameNoExtension}",
            "cwd": "\${fileDirname}",
            "preLaunchTask": "C Aktive Datei kompilieren"
        },
        {
            "name": "C++ -> Aktive-Datei debuggen",
            "type": "lldb",
            "request": "launch",
            "MIMode": "gdb",
            "program": "\${fileDirname}/\${fileBasenameNoExtension}",
            "cwd": "\${fileDirname}",
            "preLaunchTask": "C++ Aktive Datei kompilieren"
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

const launchMac = {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "cppdbg",
            "request": "launch",
            "name": "C -> Aktive-Datei",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "lldb",
            "preLaunchTask": "C Aktive Datei kompilieren"
        },
        {
            "type": "cppdbg",
            "request": "launch",
            "name": "C++ -> Aktive-Datei debuggen",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "lldb",
            "preLaunchTask": "C++ Aktive Datei kompilieren"
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

function setSettingsOnce(): void {
    const fileName = 'v2_0_0_setSettingsOnce.txt';
    const tempAddOnPath = join(getPath().tempAddOn, fileName);

	try {
		if (existsSync(tempAddOnPath)) {
			return;
		} else {
			writeFileSync(tempAddOnPath, '');
            infoNotification(`${fileName}: Fehlende und neue Einstellungen werden gesetzt!`);
			setSettingsFile();
		}
	} catch (error) {
		errorNotification(`Fehler: ${error}`);
	}
}
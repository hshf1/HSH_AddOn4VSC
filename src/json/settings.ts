import { copyFileSync, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { getPath } from "../init/paths";
import { join } from "path";
import { window, workspace } from "vscode";
import { getOSBoolean } from "../init/os";
import { getComputerraumConfig } from "../init/initMain";
import { writeLog } from "../logfile";

export function checkSettingsFile() {
	const SETTINGSJSONPATH = join(getPath().vscUserData, 'settings.json')

	try {
		statSync(SETTINGSJSONPATH) /** Überprüft ob Datei vorhanden ist */
		writeLog(`${SETTINGSJSONPATH} wurde gefunden.`, 'INFO')
	} catch (error) {
		writeLog(`${SETTINGSJSONPATH} wurde nicht gefunden.`, 'WARNING')
		setSettingsFile()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}

    addMissingSettings()
}

/** Funktion die settings.json erstellt oder aktualisiert */
export function setSettingsFile() {
	const CONTENT = getSettingsContent()
	const PATH = join(getPath().vscUserData, 'settings.json')
    createSettingsBackup()

	try {
		writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' }) /**Erstellt die settings.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
	} finally {
		writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO')
	}
}

export function addMissingSettings() {
    const SETTINGSPATH: string = join(getPath().vscUserData, 'settings.json');
    createSettingsBackup();

    if (existsSync(SETTINGSPATH)) {
        const existingSettingsContent = readFileSync(SETTINGSPATH, 'utf8');
        const existingSettingsWithoutComments = existingSettingsContent.replace(/\/\/.*/g, '');
        const existingSettings: Record<string, any> = JSON.parse(existingSettingsWithoutComments);
        
        function mergeObjects(target: any, source: any) {
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
    } else {
        // The settings.json file doesn't exist
    }
}

export function openSettingsFile() {
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

export function openOldSettingsFile() {
    const OLDSETTINGSPATH: string = join(getPath().vscUserData, 'old_settings.json');

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
    const ENCODING = getOSBoolean('Windows') ? `cp437` : `utf8`
    const AUTOUPDATE = getComputerraumConfig() ? `manual` : `default`

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

function createSettingsBackup() { // TODO: Backup nur ausführen, wenn was geändert wird in der JSON
    const SETTINGSPATH: string = join(getPath().vscUserData, 'settings.json');
    const OLDSETTINGSPATH: string = join(getPath().vscUserData, 'old_settings.json');

    try {
        if (existsSync(SETTINGSPATH)) {
            // The settings.json file exists
    
            // Create a backup copy of existing settings
            if (existsSync(OLDSETTINGSPATH)) {
                unlinkSync(OLDSETTINGSPATH);
            }
            copyFileSync(SETTINGSPATH, OLDSETTINGSPATH);
        }
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
    }
}
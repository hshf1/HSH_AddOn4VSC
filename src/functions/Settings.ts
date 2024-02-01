import { copyFileSync, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

import { getPath } from "./Paths";
import { OS, getOSBoolean } from "./OS";
import { errorNotification, infoNotification, warningNotification } from "./Notifications";
import { launchLinux, launchMac, launchWindows } from "../constants/Settings";

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

function getSettingsContent() {
    const ENCODING = getOSBoolean(OS.windows) ? `cp437` : `utf8`;
    const launch = getOSBoolean(OS.windows) ? launchWindows : getOSBoolean(OS.macOS) ? launchMac : launchLinux;
    const pythonName = getOSBoolean(OS.windows) ? `python -u` : `python3 -u`;

    const linuxLM = getOSBoolean(OS.linux) ? "cd $dir && gcc $fileName -o $fileNameWithoutExt -lm && $dir$fileNameWithoutExt" : "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt";

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
import { existsSync } from "fs";
import { execSync } from "child_process";

import { writeLog } from "./LogFile";
import { errorNotification, infoNotification } from "./Notifications";
import { initPath } from "./Paths";
import { initExtensionsDir } from "./ExtensionPath";

let os = { windows: false, osx: false, linux: false, string: '' };
let computerraum = false;

export enum OS {
    windows = 'Windows',
    macOS = 'MacOS',
    linux = 'Linux'
}

export function setOS(): void {
    os.windows = process.platform.startsWith('win');
    os.osx = process.platform === 'darwin';
    os.linux = process.platform === 'linux';

    if (os.windows) {
        os.string = OS.windows;
        initWinLocation();
    } else if (os.osx) {
        os.string = OS.macOS;
    } else if (os.linux) {
        os.string = OS.linux;
    } else {
        os.string = "Betriebssystem wurde nicht erkannt!";
    }

    writeLog(`Folgendes Betriebssystem wurde erkannt: ${os.string}`, 'INFO');
}

export function getOSBoolean(tmp: OS): boolean {
    switch (tmp) {
        case OS.windows:
            return os.windows;
        case OS.macOS:
            return os.osx;
        case OS.linux:
            return os.linux;
        default:
            return false;
    }
}

export function getOSString(): string {
    return os.string;
}

function initWinLocation(): void {
    try {
        const username = execSync(`whoami`).toString().trim();

        infoNotification(`Username: ${username}`);

        if (username.startsWith('fh-h/') || username.startsWith('fh-h\\') || existsSync(`U:\\Systemordner`)) {
            computerraum = true;
        }

    } catch (error) {
        errorNotification(`Error: ${error}`);
    } finally {
        writeLog(`Location: ${computerraum ? 'HsH-Rechner' : 'Privater Rechner'}`, 'INFO');
    }
}

export function setComputerraumConfig(tmp: boolean): void {
    const oldConfig = getComputerraumConfig();

    computerraum = tmp;

    if (oldConfig !== tmp) {
        initPath();
        initExtensionsDir();
    }
}

export function getComputerraumConfig(): boolean {
    return computerraum;
}
import { OS } from "./Init";
import { writeLog } from "../LogFile";
import { initWinLocation } from "./Init";

let os = { windows: false, osx: false, linux: false, string: '' };

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
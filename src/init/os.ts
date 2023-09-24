import { OS } from "../enum";
import { writeLog } from "../logfile";

let os = { windows: false, osx: false, linux: false, string: '' };

export function setOS(): void {
    os.windows = process.platform.startsWith('win');
    os.osx = process.platform == 'darwin';
    os.linux = process.platform == 'linux';

    if (os.windows) {
        os.string = OS[OS.Windows];
    } else if (os.osx) {
        os.string = OS[OS.MacOS];
    } else if (os.linux) {
        os.string = OS[OS.Linux];
    } else {
        os.string = "Betriebssystem wurde nicht erkannt!";
    }

    writeLog(`Folgendes Betriebssystem wurde erkannt: ${os.string}`, 'INFO');
}

export function getOSBoolean(tmp: OS): boolean {
    switch (tmp) {
        case OS.Windows:
            return os.windows;
        case OS.MacOS:
            return os.osx;
        case OS.Linux:
            return os.linux;
        default:
            return false;
    }
}

export function getOSString(): string {
    return os.string;
}
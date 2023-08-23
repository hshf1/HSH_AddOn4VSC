import { writeLog } from "../logfile";

let os = { windows: false, osx: false, linux: false, string: '' };

export function setOS(): void {
    os.windows = process.platform.startsWith('win');
    os.osx = process.platform == 'darwin';
    os.linux = process.platform == 'linux';

    if (os.windows) {
        os.string = "Windows";
    } else if (os.osx) {
        os.string = "MacOS";
    } else if (os.linux) {
        os.string = "Linux";
    } else {
        os.string = "Betriebssystem wurde nicht erkannt!";
    }

    writeLog(`Folgendes Betriebssystem wurde erkannt: ${os.string}`, 'INFO');
}

/** Mögliche Argument:
- Windows
- MacOS
- Linux

Beispiel:
`getOSBoolean('Windows')`*/
export function getOSBoolean(osString: string): boolean {
    const TEMP = osString.toLowerCase();

    switch (TEMP) {
        case 'windows':
            return os.windows;
        case 'macos':
            return os.osx;
        case 'linux':
            return os.linux;
        default:
            return false;
    }
}

export function getOSString(): string {
    return os.string;
}
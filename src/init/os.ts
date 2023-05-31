/** Modul das Funktion zur Bestimmung des Betriebssystem bereit stellt */
import { writeLog } from "../logfile"

let os = { windows: false, osx: false, linux: false, string: '' }

/** Funktion die Überprüft welches Betriebssystem vorliegt und entsprechend die Boolean setzt */
export function setOS() {
    os.windows = process.platform.startsWith('win')
    os.osx = process.platform == 'darwin'
    os.linux = !os.windows && !os.osx

    if (os.windows) {
        os.string = "Windows"
    } else if (os.osx) {
        os.string = "MacOS"
    } else if (os.linux) {
        os.string = "Linux"
    } else {
        os.string = "Betriebssystem wurde nicht erkannt!"
    }

    writeLog(`Folgendes Betriebssystem wurde erkannt: ${os.string}`, 'INFO')
}

/** Funktion die Windows, MacOS oder Linux als Eingabe bekommnt und entsprechend den Boolschen Status zurückgibt */
export function getOSBoolean(tmp: string) {
    switch (tmp) {
        case 'Windows':
            return os.windows
        case 'MacOS':
            return os.osx
        case 'Linux':
            return os.linux
        default:
            return false
    }
}

/** Funktion die Windows, MacOS oder Linux als string zurückgibt */
export function getOSString() {
    return os.string
}
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'

import { getComputerraumConfig, getProgLanguageConfig } from './initMain'
import { writeLog } from '../logfile'
import { getOSString } from './os'

let paths: Paths

/** Wird die Klasse aufgerufen, werden Pfade entsprechend dem Betriebssystem bereitgestellt.
 * 
 * Bsp: 
 * 
 * `const paths = new Paths()`
 */
export class Paths {
    private readonly userHomeRO: string
    private readonly osRO: string
    private readonly langRO: string
    private readonly hshRO: boolean

    constructor() {
        this.osRO = getOSString()
        this.langRO = getProgLanguageConfig()
        this.userHomeRO = homedir()
        this.hshRO = getComputerraumConfig()
    }

    get userHome(): string {
        return this.userHomeRO
    }

    get userWorkParentFolder(): string {
        if (this.hshRO) {
            return `U:`
        } else {
            return `${this.userHomeRO}\\Documents`
        }
    }

    get vscUserData(): string {
        switch (this.osRO) {
            case 'Windows':
                return `${this.userHome}\\AppData\\Roaming\\Code\\User`
            case 'MacOS':
                return `${this.userHome}/Library/Application Support/Code/User`
            case 'Linux':
                return `${this.userHome}/.config/Code/User`
            default:
                return ''
        }
    }

    get tempAddOn(): string {
        return `${this.vscUserData}\\HSH_AddOn4VSC`
    }

    get uebungsFolder(): string {
        switch (this.langRO) {
            case 'C':
                return `${this.userWorkParentFolder}\\C_Uebung`
            case 'Java':
                return `${this.userWorkParentFolder}\\Java_Uebung`
            case 'Python':
                return `${this.userWorkParentFolder}\\Python_Uebung`
            default:
                return ``
        }
    }

    get testProgFile(): string {
        switch (this.langRO) {
            case 'C':
                return `${this.uebungsFolder}\\testprog.c`
            case 'Java':
                return `${this.uebungsFolder}\\HelloWorld.java`
            case 'Python':
                return `${this.uebungsFolder}\\HelloWorld.py`
            default:
                return ``
        }
    }
}

/** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
export function initPath() {
    paths = new Paths()
    if (!existsSync(paths.tempAddOn)) { // TODO: Ordner erstellen wenn nicht da dort machen, wo es auch aufgerufen wird
        try {
            mkdirSync(paths.tempAddOn)
        } catch (error: any) {
            writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
        }
    }
}

/** Funktion, die die Pfade zurückgibt und somit global verfügbar macht */
export function getPath(): Paths {
    return paths
}
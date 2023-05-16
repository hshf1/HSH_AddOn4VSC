import { homedir } from 'os' /** Importiert die homedir Funktion aus dem Node.js Modul. Die homedir-Funktion gibt das Heimatverzeichnis des aktuellen Benutzers als Zeichenfolge zurück. */
import { existsSync, mkdirSync } from 'fs'

import { getComputerraumConfig, getProgLanguageConfig } from './initMain'
import { writeLog } from '../logfile'
import { getOSString } from './os'
import { join } from 'path'

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
            return join(this.userHomeRO, 'Documents')
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
        return join(this.vscUserData, 'HSH_AddOn4VSC')
    }

    get uebungsFolder(): string {
        switch (this.langRO) {
            case 'C':
                return join(this.userWorkParentFolder, 'C_Uebung')
            case 'Java':
                return join(this.userWorkParentFolder, 'Java_Uebung')
            case 'Python':
                return join(this.userWorkParentFolder, 'Python_Uebung')
            default:
                return ``
        }
    }

    get testProgFile(): string {
        switch (this.langRO) {
            case 'C':
                return join(this.uebungsFolder, 'testprog.c')
            case 'Java':
                return join(this.uebungsFolder, 'HelloWorld.java')
            case 'Python':
                return join(this.uebungsFolder, 'HelloWorld.py')
            default:
                return ``
        }
    }
}

/** Funktion die die Pfade abhängig vom Betriebssystem bestimmt und in Variablen speichert */
export function initPath() {
    paths = new Paths()
    if (!existsSync(paths.tempAddOn)) {
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
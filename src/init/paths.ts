import { homedir } from 'os';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { getComputerraumConfig, getProgLanguageConfig } from './init';
import { writeLog } from '../logfile';
import { getOSString } from './os';

let paths: Paths;

export class Paths {
    private readonly userHomeRO: string;
    private readonly osRO: string;
    private readonly langRO: string;
    private readonly hshRO: boolean;

    constructor() {
        this.osRO = getOSString();
        this.langRO = getProgLanguageConfig();
        this.userHomeRO = homedir();
        this.hshRO = getComputerraumConfig();
    }

    get userHome(): string {
        return this.userHomeRO;
    }

    get userWorkParentFolder(): string {
        if (this.hshRO) {
            return `U:`;
        } else {
            return join(this.userHomeRO, 'Documents');
        }
    }

    get vscUserData(): string {
        switch (this.osRO) {
            case 'Windows':
                return `${this.userHome}\\AppData\\Roaming\\Code\\User`;
            case 'MacOS':
                return `${this.userHome}/Library/Application Support/Code/User`;
            case 'Linux':
                return `${this.userHome}/.config/Code/User`;
            default:
                return '';
        }
    }

    get tempAddOn(): string {
        return join(this.vscUserData, 'HSH_AddOn4VSC');
    }

    get uebungsFolder(): string {
        switch (this.langRO) {
            case 'C':
                return join(this.userWorkParentFolder, 'C_Uebung');
            case 'Java':
                return join(this.userWorkParentFolder, 'Java_Uebung');
            case 'Python':
                return join(this.userWorkParentFolder, 'Python_Uebung');
            default:
                return ``;
        }
    }

    get testProgFile(): string {
        switch (this.langRO) {
            case 'C':
                return join(this.uebungsFolder, 'testprog.c');
            case 'Java':
                return join(this.uebungsFolder, 'HelloWorld.java');
            case 'Python':
                return join(this.uebungsFolder, 'HelloWorld.py');
            default:
                return ``;
        }
    }
}

export function initPath(): void {
    paths = new Paths();
    if (!existsSync(paths.tempAddOn)) {
        try {
            mkdirSync(paths.tempAddOn);
            writeLog(`HsH_AddOn4VSC Temp-Ordner wurde erstellt`, 'INFO')
        } catch (error: any) {
            writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
        }
    }
    
}

export function getPath(): Paths {
    return paths
}
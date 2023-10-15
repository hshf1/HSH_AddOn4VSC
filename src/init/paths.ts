import { homedir } from 'os';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

import { getComputerraumConfig, restartVSC } from './init';
import { writeLog } from '../logfile';
import { getOSBoolean, getOSString } from './os';
import { initExtensionsDir } from '../extensionPath';
import { OS } from './enum';
import { getProgLanguageString, initLanguage } from './language';

let paths: Paths;
let reloadNeeded: boolean = false;

export class Paths {
    private readonly userHomeRO: string;
    private readonly osRO: string;
    private readonly langRO: string;
    private readonly hshRO: boolean;

    constructor() {
        this.osRO = getOSString();
        this.langRO = getProgLanguageString();
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

    get reportAProblemString(): string {
        return 'zehpziuruwsucfzf';
    }
}

export function initPath(): void {
    initLanguage();
    paths = new Paths();
    if (!existsSync(paths.tempAddOn)) {
        try {
            mkdirSync(paths.tempAddOn);
            writeLog(`HsH_AddOn4VSC Temp-Ordner wurde erstellt`, 'INFO');
        } catch (error: any) {
            writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
        }
    }

}

export function getPath(): Paths {
    return paths;
}

export async function checkPaths() {
    if (getOSBoolean(OS.windows)) {
        await initExtensionsDir();
        await deleteOldPath('C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin');

        if (getComputerraumConfig()) {
            await addNewPath('C:\\Program Files\\mingw64\\bin');
        } else {
            await addNewPath('C:\\ProgramData\\chocolatey\\bin');
            await addNewPath('C:\\ProgramData\\chocolatey\\lib\\mingw\\tools\\install\\mingw64\\bin');
        }
        
        if (reloadNeeded) {
            restartVSC();
        }
    }
}

export async function addNewPath(tmp: string) {
    const pathToAdd: string = tmp;
    let pathVar = await getUserEnvironmentPath();
    const pathDirs = pathVar.split(';');
    if (!pathDirs.includes(pathToAdd)) {
        pathDirs.push(pathToAdd);
        pathVar = pathDirs.join(';');
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR');
            } else {
                writeLog(`Neue Umgebungsvariable (${pathToAdd}) erfolgreich hinzugefügt: ${stdout.trim()}`, 'INFO');
                reloadNeeded = true;
            }
        });
    } else {
        writeLog(`Umgebungsvariable ist bereits vorhanden.`, 'INFO');
    }
}

export async function deleteOldPath(tmp: string) {
    const pathToRemove: string = tmp;
    let pathVar = await getUserEnvironmentPath();
    const pathDirs = pathVar.split(';');
    const index = pathDirs.indexOf(pathToRemove);
    if (index !== -1) {
        pathDirs.splice(index, 1);
        pathVar = pathDirs.join(';');
        exec(`setx PATH "${pathVar}"`, (error, stdout, stderr) => {
            if (error) {
                writeLog(`Fehler beim entfernen alter Umgebungsvariable: ${error.message}`, 'ERROR');
            } else {
                writeLog(`Alte Umgebungsvariable erfolgreich entfernt: ${stdout.trim()}`, 'INFO');
                reloadNeeded = true;
            }
        });
    } else {
        writeLog(`Alte Umgebungsvariable ist bereits gelöscht.`, 'INFO');
    }
}

export function getUserEnvironmentPath(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('reg query HKCU\\Environment /v Path', (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                const matches = stdout.match(/Path\s+REG_SZ\s+(.*)/);
                if (matches) {
                    resolve(matches[1]);
                } else {
                    resolve('');
                }
            }
        });
    });
}
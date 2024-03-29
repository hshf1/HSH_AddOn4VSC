import { homedir } from 'os';
import { join } from 'path';
import { exec } from 'child_process';

import { writeLog } from './LogFile';
import { OS, getComputerraumConfig, getOSBoolean, getOSString } from './OS';
import { initExtensionsDir } from './ExtensionPath';
import { createFile, createFolder, restartVSC } from './Utils';
import { getCTestProg, getJavaTestProg, getPythonTestProg } from '../constants/TestProgFiles';

let paths: Paths;
let reloadNeeded: boolean = false;

export class Paths {
    private readonly userHomeRO: string;
    private readonly osRO: string;
    private readonly hshRO: boolean;

    constructor() {
        this.osRO = getOSString();
        this.userHomeRO = homedir();
        this.hshRO = getComputerraumConfig();
    }

    get userHome(): string {
        return this.userHomeRO;
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

    get userWorkParentFolder(): string {
        if (this.hshRO) {
            return this.tempAddOn;
        } else {
            return join(this.userHomeRO, 'Documents');
        }
    }

    get hshMainUserFolder(): string {
        return join(this.userWorkParentFolder, 'HsH_Uebung');
    }

    get cUebungsFolder(): string {
        return join(this.hshMainUserFolder, 'C_Uebung');
    }
    
    get javaUebungsFolder(): string {
        return join(this.hshMainUserFolder, 'Java_Uebung');
    }
    
    get pythonUebungsFolder(): string {
        return join(this.hshMainUserFolder, 'Python_Uebung');
    }

    get cTestProgFile(): string {
        return join(this.cUebungsFolder, 'testprog.c');
    }

    get javaTestProgFile(): string {
        return join(this.javaUebungsFolder, 'HelloWorld.java');
    }

    get pythonTestProgFile(): string {
        return join(this.pythonUebungsFolder, 'HelloWorld.py');
    }

    get settingsFile(): string {
        return join(this.vscUserData, 'settings.json');
    }

    get tasksFile(): string {
        return join(this.vscUserData, 'tasks.json');
    }

    get oldSettingsFile(): string {
        return join(this.tempAddOn, 'old_settings.json');
    }

    get reportAProblemString(): string {
        return 'hbeidpesfodxkogy';
    }
}

export function initPath(): void {
    paths = new Paths();

    createFolder(paths.tempAddOn);
    createFolder(paths.hshMainUserFolder);
    createFolder(paths.cUebungsFolder);
    createFolder(paths.javaUebungsFolder);
    createFolder(paths.pythonUebungsFolder);

    createFile(paths.cTestProgFile, getCTestProg());
    createFile(paths.javaTestProgFile, getJavaTestProg());
    createFile(paths.pythonTestProgFile, getPythonTestProg());
}

export function getPath(): Paths {
    return paths;
}

export async function checkPaths(): Promise<void> {
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

export async function addNewPath(tmp: string): Promise<void> {
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

export async function deleteOldPath(tmp: string): Promise<void> {
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
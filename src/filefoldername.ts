import { Uri, workspace, window, commands } from 'vscode';
import { extname, dirname, basename, join, parse } from 'path';
import { existsSync } from 'fs';

import { getOSBoolean } from './init/os';
import { writeLog } from './logfile';
import { OS } from './init/enum';
import { warningNotification } from './notifications';

let firstInit: boolean = false;

export async function checkName() {
    const filePath: string = window.activeTextEditor?.document.uri.fsPath || "no_file_defined";

    const constdirname = dirname(filePath).toLowerCase();
    const constbasename = basename(filePath).toLowerCase();
    const basenameWithoutExt = parse(constbasename).name;
    const constextname = extname(filePath);

    if (getOSBoolean(OS.windows) && (constdirname.indexOf('ä') !== -1 || constdirname.indexOf('ö') !== -1 || constdirname.indexOf('ü') !== -1 || constdirname.indexOf(' ') !== -1)) {
        warningNotification(`${constdirname} enthält Umlaute oder Leerzeichen! Diese müssen manuell umbenannt werden!`, true);
    }

    if (basenameWithoutExt.indexOf('ä') !== -1 || basenameWithoutExt.indexOf('ö') !== -1 || basenameWithoutExt.indexOf('ü') !== -1 || basenameWithoutExt.indexOf(' ') !== -1 || basenameWithoutExt.indexOf('.') !== -1 /** || constextname !== '.c' */) {
        if (filePath === "no_file_defined" || filePath === undefined || filePath.includes('settings.json') || filePath.includes('tasks.json')) {
            return;
        }
        if (!firstInit) {
            firstInit = true;
            return;
        }
        await rename(filePath);
    }
}

async function rename(currentPath: string) {
    const invalidChars = /[äöü ÄÖÜ.]/g;
    let renameanfrage = await window.showWarningMessage(
        writeLog(`Es sind Fehler im Dateinamen vorhanden!`, 'WARNING') + 'Sollen diese automatisch angepasst werden?',
        'Ja',
        'Nein',
    ) || '';

    if (renameanfrage === 'Ja') {
        let newfullname: any;
        const constdirname = dirname(currentPath);
        const basenameWithoutExt = parse(currentPath).name;
        const constextname = extname(currentPath);

        const replacedBasename = basenameWithoutExt.replace(invalidChars, (char: string) => {
            return {
                ' ': '_',
                'ä': 'ae',
                'ö': 'oe',
                'ü': 'ue',
                'Ä': 'AE',
                'Ö': 'OE',
                'Ü': 'UE',
                '.': '_',
            }[char] || char;
        });
        const newName = replacedBasename.concat(constextname);
        newfullname = join(constdirname, newName);

        //TODO: später anpassen je nach eingestellter programmiersprache
        // if (extname(currentPath) !== '.c') { /** Überprüft ob der aktuelle Pfad nicht .c enthält*/
        //     if (extname(currentPath) === '') { /** Falls gar keine Endung existiert wird .c drangehängt */
        //         newfullname = newfullname + '.c'
        //     } else {
        //         newfullname = newfullname.replace(extname(currentPath), '.c') /** Falls schon eine Endung existiert wird diese ausgetauscht */
        //     }
        // }

        saveRename(currentPath, newfullname);
    }
}

async function saveRename(currentPath: string, newfullname: any) {
    if (existsSync(newfullname)) {
        let parsedPath = parse(newfullname);
        let newName = join(parsedPath.dir, `${parsedPath.name}_1${parsedPath.ext}`);
        saveRename(currentPath, newName);
    } else {
        await workspace.fs.rename(Uri.file(currentPath), Uri.file(currentPath).with({ path: newfullname }));
    }
}

export async function switchDirectory() {
    const activeEditor = window.activeTextEditor;
    if (activeEditor) {
        const currentFilePath = activeEditor.document.uri.fsPath;
        const currentFileDirectory = dirname(currentFilePath);
        const folderUri = Uri.file(currentFileDirectory);
        commands.executeCommand(`vscode.openFolder`, folderUri);
    } else {
        window.showInformationMessage('Es ist keine Datei zum Wechseln des Verzeichnisses geöffnet.');
    }
}

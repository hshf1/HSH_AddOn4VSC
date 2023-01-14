import { Uri, workspace, window } from 'vscode'
import { extname, dirname, basename, join, parse } from 'path'
import { existsSync } from 'fs';

export async function checkname() {
    var filePath: string = window.activeTextEditor?.document.uri.fsPath || "no_file_defined"

    if (filePath.toLowerCase().indexOf('ä') !== -1 || filePath.toLowerCase().indexOf('ö') !== -1 || filePath.toLowerCase().indexOf('ü') !== -1 || filePath.toLowerCase().indexOf(' ') !== -1 || extname(filePath) !== '.c') {
        await rename(filePath)
    }
}

async function rename(currentPath: string) {
    const invalidChars = /[äöü ÄÖÜ]/g;
    let renameanfrage = await window.showWarningMessage(
        `Es sind Fehler im Dateinamen vorhanden! Sollen diese automatisch angepasst werden?`,
        'Ja',
        'Nein',
    ) || ''

    if (renameanfrage === 'Ja') {
        let newfullname: any;
        const constdirname = dirname(currentPath);
        const constbasename = basename(currentPath)

        if (constdirname.toLowerCase().indexOf('ä') !== -1 || constdirname.toLowerCase().indexOf('ö') !== -1 || constdirname.toLowerCase().indexOf('ü') !== -1 || constdirname.toLowerCase().indexOf(' ') !== -1) {
            window.showErrorMessage(`${constdirname} enthält Umlaute oder Leerzeichen! Diese müssen manuell umbenannt werden!`)
        }

        const replacedBasename = constbasename.replace(invalidChars, (char: string) => {
            return {
                ' ': '_',
                'ä': 'ae',
                'ö': 'oe',
                'ü': 'ue',
                'Ä': 'AE',
                'Ö': 'OE',
                'Ü': 'UE',
            }[char] || char;
        })

        newfullname = join(constdirname, replacedBasename)

        if (extname(currentPath) !== '.c') {
            if (extname(currentPath) === '') {
                newfullname = newfullname + '.c'
            } else {
                newfullname = newfullname.replace(extname(currentPath), '.c')
            }
        }
        save_rename(currentPath, newfullname)
    }
}

async function save_rename(currentPath: string, newfullname: any) {
    if (existsSync(newfullname)) {
        let parsedPath = parse(newfullname)
        let newName = join(parsedPath.dir, `${parsedPath.name}_1${parsedPath.ext}`)
        save_rename(currentPath, newName)
    } else {
        await workspace.fs.rename(Uri.file(currentPath), Uri.file(currentPath).with({ path: newfullname }))
    }
}
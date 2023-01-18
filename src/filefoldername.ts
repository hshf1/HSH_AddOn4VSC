import { Uri, workspace, window } from 'vscode'
import { extname, dirname, basename, join, parse } from 'path'
import { existsSync } from 'fs';
import { IS_WINDOWS } from './init';

export async function checkname() {
    const filePath: string = window.activeTextEditor?.document.uri.fsPath || "no_file_defined"
    const constdirname = dirname(filePath).toLowerCase()
    const constbasename = basename(filePath).toLowerCase()
    const constextname = extname(filePath)

    if (IS_WINDOWS && (constdirname.indexOf('ä') !== -1 || constdirname.indexOf('ö') !== -1 || constdirname.indexOf('ü') !== -1 || constdirname.indexOf(' ') !== -1)) {
        window.showErrorMessage(`${constdirname} enthält Umlaute oder Leerzeichen! Diese müssen manuell umbenannt werden!`)
    }

    if (constbasename.indexOf('ä') !== -1 || constbasename.indexOf('ö') !== -1 || constbasename.indexOf('ü') !== -1 || constbasename.indexOf(' ') !== -1 || constextname !== '.c') {
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
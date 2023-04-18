/** Dieses Modul enthält Funktionen um, die Namen der Dateien und Pfade zu kontrollieren und ggf. zu ersetzen */

import { Uri, workspace, window } from 'vscode' /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { extname, dirname, basename, join, parse } from 'path' 
/** Das path-Modul in Node.js stellt Funktionen zum Arbeiten mit Dateipfaden bereit. Die fünf Funktionen, die hier importiert werden, sind:
 *  extname: Diese Funktion gibt die Dateierweiterung eines Dateipfads zurück, z. B. ".js" oder ".txt".
 *  dirname: Diese Funktion gibt den Ordnerpfad des Dateipfads zurück, z. B. "/home/user/documents/".
 *  basename: Diese Funktion gibt den Dateinamen des Dateipfads zurück, z. B. "file.txt".
 *  join: Diese Funktion fügt zwei oder mehrere Pfade zu einem vollständigen Dateipfad zusammen, unabhängig vom Betriebssystem, auf dem der Code ausgeführt wird.
 *  parse: Diese Funktion analysiert einen Dateipfad und gibt ein Objekt zurück, das aus verschiedenen Teilen des Pfads besteht, wie dem Ordnerpfad, dem Dateinamen und der Erweiterung.
*/  
import { existsSync } from 'fs' /** Importiert das existsSync Modul aus node.js, dadurch ist es möglich zu überprüfen ob eine Datei auf dem Dateisystem vorhanden ist */

import { getOS } from './init' /** Importiert die Funktion zur bestimmung des Betriebssystems aus init.ts */

let firstInit: boolean = false; /** Deklariert eine Variable die auskunft darüber gibt ob eine erste Initalisierung schonmal statt gefunden hat */

export async function checkname() {
    const filePath: string = window.activeTextEditor?.document.uri.fsPath || "no_file_defined" 
    /** Speichert den Dateipfad der aktuell geöffneten Datei, falls keine Datei offen ist wird "no_file_defined" gespeichert */
    const constdirname = dirname(filePath).toLowerCase()    /** Speichert den Ordnerpfad von Filepath */
    const constbasename = basename(filePath).toLowerCase()  /** Speichert den Dateinamen von Filepath */
    const constextname = extname(filePath)  /** Speichert die Endung der Datei von Filepath z.B .js */

    if (getOS('WIN') && (constdirname.indexOf('ä') !== -1 || constdirname.indexOf('ö') !== -1 || constdirname.indexOf('ü') !== -1 || constdirname.indexOf(' ') !== -1)) {
    /** Überprüft ob der Ordnerpfad Umlaute enthält und ob es sich um einen Windows PC handelt */
        window.showErrorMessage(`${constdirname} enthält Umlaute oder Leerzeichen! Diese müssen manuell umbenannt werden!`)
    }

    if (constbasename.indexOf('ä') !== -1 || constbasename.indexOf('ö') !== -1 || constbasename.indexOf('ü') !== -1 || constbasename.indexOf(' ') !== -1 || constextname !== '.c') {
        /** Überprüft ob der Dateiname Umlaute enthält oder nicht mit .c endet */
        if (filePath === "no_file_defined" || filePath === undefined || filePath.includes('settings.json') || filePath.includes('tasks.json')) {
            /** Falls nicht definiert oder eine .json wird Funktion abgebrochen */
            return
        }
        if (!firstInit) { /** first init wird true gesetzt */
            firstInit = true
            return
        }
        await rename(filePath) /** Ruft die rename Funktion auf und übergibt den FilePath */
    }
}

async function rename(currentPath: string) {
    const invalidChars = /[äöü ÄÖÜ]/g; /** Definiert die ungültigen Chars */
    let renameanfrage = await window.showWarningMessage( /** Fragt Benutzer ob Fehler ausgebessert werden sollen */
        `Es sind Fehler im Dateinamen vorhanden! Sollen diese automatisch angepasst werden?`,
        'Ja',
        'Nein',
    ) || ''

    if (renameanfrage === 'Ja') {
        let newfullname: any; /** Erstellt neue Variable vom Typ Any um den neuen Dateipfad zwischen zu speichern */
        const constdirname = dirname(currentPath); /** Übergibt Ordnerpfad */
        const constbasename = basename(currentPath) /** Übergibt Dateinamen */ 

        const replacedBasename = constbasename.replace(invalidChars, (char: string) => {
        /** Definiert neue Konstante die den neuen umgeschriebenen Dateinamen enthält */
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

        newfullname = join(constdirname, replacedBasename) /** Verbindet den Ordnerpfad und den neuen Dateinamen und speichert ihn */

        if (extname(currentPath) !== '.c') { /** Überprüft ob der aktuelle Pfad nicht .c enthält*/
            if (extname(currentPath) === '') { /** Falls gar keine Endung existiert wird .c drangehängt */
                newfullname = newfullname + '.c'
            } else {
                newfullname = newfullname.replace(extname(currentPath), '.c') /** Falls schon eine Endung existiert wird diese ausgetauscht */
            }
        }
        save_rename(currentPath, newfullname) /** Ruft Funktion auf die den neuen Namen speichert */
    }
}

async function save_rename(currentPath: string, newfullname: any) { /** Funktion die den neuen Namen einspeichert, bekommt den alten und den neuen Namen+Pfad */
    if (existsSync(newfullname)) {  /** Überprüft ob der neue Name der Datei schon existiert */
        let parsedPath = parse(newfullname)
        let newName = join(parsedPath.dir, `${parsedPath.name}_1${parsedPath.ext}`) /** Hängt an den Namen ein "_1" */
        save_rename(currentPath, newName) /** Funktion ruft sich selbst neu auf */
    } else {
        await workspace.fs.rename(Uri.file(currentPath), Uri.file(currentPath).with({ path: newfullname })) /** Überschreibt den alten Namen mit dem neuen */
    }
}

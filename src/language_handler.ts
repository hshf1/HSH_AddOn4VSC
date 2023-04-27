import { window } from 'vscode'
import { getHsHRZ } from './init'
import { openprefolder } from './checkfolder'
import * as vscode from 'vscode'

let active_language: string



export async function init_language() { //Initialisiert einmalig eine Sprache

        const folders = vscode.workspace.workspaceFolders // Überprüft ob Ordner geöffnet ist und speichert den Namen falls vorhanden
        if (!folders || folders.length === 0) { // kein Ordner ist geöffnet wird einfach der C Ordner geöffnet            
            active_language = "C"
            openprefolder(active_language)
            return
        }

        const currentFolderName = folders[0].name
        if (currentFolderName === 'C_Uebung') { // wenn im C Ordner speicher C als aktive Sprache
            active_language = 'C'
        } else if (currentFolderName === 'Java_Uebung') { // wenn im Java Ordner speicher java als aktive Sprache
            active_language = 'Java'
        } else if (currentFolderName === 'Python_Uebung') { // wenn im Java Ordner speicher java als aktive Sprache
            active_language = 'Python'
        } else {
            active_language = 'C'  //Falls unbekannter Ordner geöffnet ist wird einfach C als aktive Sprache gesetzt
        }
}



export async function set_language(temp_language: String) {

    if (getHsHRZ() == false && temp_language != "C") { //Damit wird gewährleistet, dass an privaten Rechnern erstmal nur C ausgewählt werden kann.
        window.showInformationMessage('Diese Funktion ist zurzeit nur an HSH Rechnern möglich')
        return
    }


    if (temp_language == active_language) { /** Überprüft ob Sprache bereits aktiv ist */
        (window.showInformationMessage('Programmiersprache bereits aktiv'))
        return
    }

    if (temp_language == "C") {

        active_language = "C";
        window.showInformationMessage('C Ausgewählt')
        await openprefolder("C")

    } else if (temp_language == "Java") {

        active_language = "Java";
        window.showInformationMessage('Java Ausgewählt')
        await openprefolder("Java")

    } else if (temp_language == "Python") {

        active_language = "Python";
        window.showInformationMessage('Python Ausgewählt')
        await openprefolder("Python")
    }

    return

}

export function get_active_prog_language() {
    return active_language
}
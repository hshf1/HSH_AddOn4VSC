import { window } from 'vscode'
import { getHsHRZ } from './init'
import { openprefolder } from './checkfolder';
import * as vscode from 'vscode';
import * as path from 'path';

let active_language: string



export async function init_language() { //Initialisiert einmalig eine Sprache

    let init_status: boolean | undefined = undefined

    if (init_status != true) { 
        init_status = true

        const folders = vscode.workspace.workspaceFolders; // Überprüft ob Ordner geöffnet ist und speichert den Namen falls vorhanden
        if (!folders || folders.length === 0) { // kein Ordner ist geöffnet wird einfach der C Ordner geöffnet            
            active_language = "C"       
            openprefolder(active_language)
            return;
        }

        const currentFolderName = folders[0].name; 
        if (currentFolderName === 'C_Uebung') { // wenn im C Ordner speicher C als aktive Sprache
            active_language = 'C';
            return
        } else if (currentFolderName === 'Java_Uebung') { // wenn im Java Ordner speicher java als aktive Sprache
            active_language = 'Java';
            return
        }

        active_language = 'C';  //Falls unbekannter Ordner geöffnet ist wird einfach C als aktive Sprache gesetzt
    }

    return
}



export async function set_language(temp_language: String) {

    /*if(getHsHRZ()==false){ //TODO ÄNDERN 
        (window.showInformationMessage('Diese Funktion ist zurzeit nur an HSH Rechnern möglich'))
        active_language = "C"; //Für alle Fälle
        return
    }*/


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
    }
    return

}

export function get_active_prog_language() {
    return active_language
}
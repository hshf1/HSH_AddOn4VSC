import { ConfigurationTarget, window, workspace } from 'vscode'

import { writeLog } from './logfile'
import { getProgLanguageString, setProgLanguageConfig } from './init/init'
import { openPreFolder } from './checkfolder'

export async function init_language() {

        // const folders = workspace.workspaceFolders // Überprüft ob Ordner geöffnet ist und speichert den Namen falls vorhanden
        // if (!folders || folders.length === 0) { // kein Ordner ist geöffnet wird einfach der C Ordner geöffnet            
        //     active_language = "C"
        //     openprefolder(active_language)
        //     return
        // }

        // const currentFolderName = folders[0].name
        // if (currentFolderName === 'C_Uebung') { // wenn im C Ordner speicher C als aktive Sprache
        //     active_language = 'C'
        // } else if (currentFolderName === 'Java_Uebung') { // wenn im Java Ordner speicher java als aktive Sprache
        //     active_language = 'Java'
        // } else if (currentFolderName === 'Python_Uebung') { // wenn im Java Ordner speicher java als aktive Sprache
        //     active_language = 'Python'
        // } else {
        //     active_language = 'C'  //Falls unbekannter Ordner geöffnet ist wird einfach C als aktive Sprache gesetzt
        // }
}

export async function set_language() {
    const PROGLANGUAGE = getProgLanguageString()

    const newLanguage = await window.showQuickPick(['C', 'Java', 'Python', 'Abbrechen'], {
        canPickMany: false,
        placeHolder: 'Programmiersprache wählen...',
        ignoreFocusOut: true
    }) || ''

    if (newLanguage === '' || newLanguage === 'Abbrechen') {
        window.showInformationMessage('Auswahl der Programmiersprache abgebrochen!')
        return
    }

    if (newLanguage === PROGLANGUAGE) {
        window.showInformationMessage('Programmiersprache bereits aktiv')
        return
    }

    setProgLanguageConfig(newLanguage)
    window.showInformationMessage(writeLog(`${newLanguage} ausgewählt`, 'INFO'))
}
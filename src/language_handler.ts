import { window } from 'vscode';

import { writeLog } from './logfile';
import { getProgLanguageString, setProgLanguageConfig } from './init/init';
import { ProgLang } from './enum';

export async function setLanguage() {
    const PROGLANGUAGE = getProgLanguageString();

    const newLanguage = await window.showQuickPick([ProgLang.c, ProgLang.java, ProgLang.python, 'Abbrechen'], {
        canPickMany: false,
        placeHolder: 'Programmiersprache wählen...',
        ignoreFocusOut: true
    }) || '';

    if (newLanguage === '' || newLanguage === 'Abbrechen') {
        window.showInformationMessage('Auswahl der Programmiersprache abgebrochen!');
        return;
    }

    if (newLanguage === PROGLANGUAGE) {
        window.showInformationMessage('Programmiersprache bereits aktiv');
        return;
    }

    setProgLanguageConfig(newLanguage);
    window.showInformationMessage(writeLog(`${newLanguage} ausgewählt`, 'INFO'));
}
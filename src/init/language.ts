import { ConfigurationTarget, window, workspace } from "vscode";
import { ProgLang } from "../enum";
import { writeLog } from "../logfile";

let language: string = ProgLang.c;

export function initLanguage(): void {
    try {
        language = workspace.getConfiguration('addon4vsc').get('sprache', ProgLang.c);
        writeLog(`Initialisierte Programmiersprache: ${language}`, 'INFO');
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
    }
}

export function getProgLanguageString(): string {
    return language;
}

export function setProgLanguageConfig(tmp: string) {
    try {
        workspace.getConfiguration('addon4vsc').update('sprache', tmp, ConfigurationTarget.Global);
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
    }
}

export function getProgLanguageBoolean(tmp: ProgLang): boolean {
    return language === tmp;
}

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
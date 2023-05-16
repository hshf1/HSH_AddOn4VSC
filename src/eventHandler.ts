import { commands, window, workspace } from "vscode"

import { getComputerraumConfig, getStatusBarItem } from "./init/initMain"
import { writeLog } from "./logfile"
import { checkName } from "./filefoldername" /** Importiert die Funktion zum überprüfen des Dateinames aus filefoldername.ts */
import { getPath, initPath } from "./init/paths"
import { getOSBoolean } from "./init/os"

export function eventHandler_checkName() {    /** Code definiert eine Funktion die als Event Handler fungiert */
    if (getStatusBarItem().command === 'extension.off') {	/** überprüft ob der Statusleisten Button auf "pausiert" steht */
        checkName()                         			/**	Führt die Funktion aus die den Namen überprüft und wartet bis sie fertig ist */
    }
}

export function eventHandler_changeProgLanguage() {
	const COMPUTERRAUM = getComputerraumConfig()
    const OPENWORKSPACE = workspace.workspaceFolders?.toString() || ''

    if (!getOSBoolean('Windows') || !COMPUTERRAUM) {
        window.showWarningMessage(writeLog('Programmiersprache wechseln ist derzeit nur an HsH Rechnern verfügbar!', 'WARNING'))
        return
    }
    initPath()
    if (OPENWORKSPACE.includes(getPath().uebungsFolder)) { /** überprüft ob sich der Wert geändert hat */
        commands.executeCommand('workbench.action.closeFolder')
    }
}
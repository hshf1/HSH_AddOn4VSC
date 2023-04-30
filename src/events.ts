import { commands, window, workspace } from "vscode"
import { getComputerraumConfig, getOS, getPath, getStatusBarItem, initPath } from "./init"
import { writeLog } from "./logfile"
import { checkName } from "./filefoldername"

export function eventHandler_checkName() {    /** Code definiert eine Funktion die als Event Handler fungiert */
		if (getStatusBarItem().command === 'extension.off') {	/** überprüft ob der Statusleisten Button auf "pausiert" steht */
			checkName()                         			/**	Führt die Funktion aus die den Namen überprüft und wartet bis sie fertig ist */
		}
}

export function eventHandler_changeLocation() {
    
}

export function eventHandler_changeProgLanguage() {
	const COMPUTERRAUM = getComputerraumConfig()
    const OPENWORKSPACE = workspace.workspaceFolders?.toString() || ''

    if (!getOS('WIN') || !COMPUTERRAUM) {
        window.showWarningMessage(writeLog('Programmiersprache wechseln ist derzeit nur an HsH Rechnern verfügbar!', 'WARNING'))
        return
    }
    initPath()
    if (OPENWORKSPACE.includes(getPath('uebungfolder'))) { /** überprüft ob sich der Wert geändert hat */
        commands.executeCommand('workbench.action.closeFolder')
    }
}
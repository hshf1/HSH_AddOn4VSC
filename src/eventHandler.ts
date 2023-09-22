import { ConfigurationChangeEvent, commands, debug, workspace } from "vscode"

import { getStatusBarItem } from "./init/init";
import { checkName } from "./filefoldername";
import { getPath, initPath } from "./init/paths"
import { openPreFolder } from "./checkfolder";

export function eventHandler_checkName() {  
    if (getStatusBarItem().command === 'extension.off') {
        checkName()
    }
}

export function initEvents() {
    workspace.onDidSaveTextDocument(eventHandler_checkName)
	debug.onDidChangeBreakpoints(eventHandler_checkName)
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {	
		if (event.affectsConfiguration('addon4vsc.sprache')) {
			eventHandler_changeProgLanguage()
		}
	})
}

export function eventHandler_changeProgLanguage() {
    const OPENWORKSPACE = workspace.workspaceFolders?.toString() || ''

    initPath()

    if (OPENWORKSPACE.includes(getPath().uebungsFolder)) {
        commands.executeCommand('workbench.action.closeFolder')
    }

    openPreFolder()
}
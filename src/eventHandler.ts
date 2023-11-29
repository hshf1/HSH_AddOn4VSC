import { ConfigurationChangeEvent, commands, debug, workspace } from "vscode";

import { checkName } from "./filefoldername";
import { getPath, initPath } from "./init/paths";
import { openPreFolder } from "./checkfolder";

export function eventHandlerCheckName(): void {  
    checkName();
}

export function initEvents(): void {
    workspace.onDidSaveTextDocument(eventHandlerCheckName);
	debug.onDidChangeBreakpoints(eventHandlerCheckName);
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {	
		if (event.affectsConfiguration('addon4vsc.sprache')) {
			eventHandlerChangeProgLanguage();
		}
	});
}

export function eventHandlerChangeProgLanguage(): void {
    const OPENWORKSPACE = workspace.workspaceFolders?.toString() || '';

    initPath();

    if (OPENWORKSPACE.includes(getPath().uebungsFolder)) {
        commands.executeCommand('workbench.action.closeFolder');
    }

    openPreFolder();
}

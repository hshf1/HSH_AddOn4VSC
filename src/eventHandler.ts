import { debug, workspace } from "vscode";

import { checkName } from "./FileFolderName";

export function eventHandlerCheckName(): void {  
    checkName();
}

export function initEvents(): void {
    workspace.onDidSaveTextDocument(eventHandlerCheckName);
	debug.onDidChangeBreakpoints(eventHandlerCheckName);
}
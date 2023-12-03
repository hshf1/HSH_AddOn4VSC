import { debug, workspace } from "vscode";

import { checkName } from "./filefoldername";

export function eventHandlerCheckName(): void {  
    checkName();
}

export function initEvents(): void {
    workspace.onDidSaveTextDocument(eventHandlerCheckName);
	debug.onDidChangeBreakpoints(eventHandlerCheckName);
}
import { ExtensionContext, debug, workspace } from 'vscode';

import { initExtension } from './init/Init';
import { initCommands } from './Commands';
import { infoNotification } from './functions/Notifications';
import { checkName } from './functions/FileFolderName';

// TODO: https://code.visualstudio.com/docs/cpp/config-mingw hier sind vielleicht bessere wege, um die Erweiterung zu verbessern
// TODO: https://github.com/microsoft/vscode-cmake-tools/blob/main/docs/README.md cmake build für mehrere dateien gleichzeitig kompilieren und eigene bib's

export function activate(context: ExtensionContext): void {
	infoNotification(`HSH_AddOn4VSC gestartet!`);
	initExtension();
	initCommands(context);

	workspace.onDidSaveTextDocument(checkName);
	debug.onDidChangeBreakpoints(checkName);
}

export function deactivate(): void {
	infoNotification(`HSH_AddOn4VSC wird ordnungsgemäß beendet!`);
}
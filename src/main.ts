import { ExtensionContext } from 'vscode';

import { initExtension } from './init/Init';
import { initEvents } from './eventHandler';
import { initCommands } from './Commands';
import { infoNotification } from './Notifications';

// TODO: https://code.visualstudio.com/docs/cpp/config-mingw hier sind vielleicht bessere wege, um die Erweiterung zu verbessern
// TODO: https://github.com/microsoft/vscode-cmake-tools/blob/main/docs/README.md cmake build für mehrere dateien gleichzeitig kompilieren und eigene bib's

export function activate(context: ExtensionContext): void {
	infoNotification(`HSH_AddOn4VSC gestartet!`);
	initExtension();
	initEvents();
	initCommands(context);
}

export function deactivate(): void {
	infoNotification(`HSH_AddOn4VSC wird ordnungsgemäß beendet!`);
}
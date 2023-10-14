import { ExtensionContext, window } from 'vscode';

import { initExtension } from './init/init';
import { initEvents } from './eventHandler';
import { initCommands } from './commands';
import { infoNotification } from './notifications';

export function activate(context: ExtensionContext): void {
	const test = process.env.TEST;
	window.showInformationMessage(`${test}`);
	infoNotification(`HSH_AddOn4VSC gestartet!`);
	initExtension();
	initEvents();
	initCommands(context);
}

export function deactivate(): void {
	infoNotification(`HSH_AddOn4VSC wird ordnungsgemäß beendet!`);
}
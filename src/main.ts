import { ExtensionContext, window } from 'vscode';

import { initExtension } from './init/init';
import { writeLog } from './logfile';
import { initEvents } from './eventHandler';
import { initCommands } from './commands';

export function activate(context: ExtensionContext): void {
	const test2 = process.env.SMTP_USERNAME;
	window.showInformationMessage(`${test2}`)
	writeLog(`HSH_AddOn4VSC gestartet!`, 'INFO');
	initExtension();
	initEvents();
	initCommands(context);
}

export function deactivate(): void {
	writeLog('HSH_AddOn4VSC wird ordnungsgemäß beendet!', 'INFO');
}
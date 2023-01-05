import { ExtensionContext, commands, workspace, debug } from 'vscode'
import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { active_addon, active_addon_func } from './status_bar'
import { constregistercommands } from './registercommands'

export function activate(context: ExtensionContext) {

	/**************************************************************************************
	Beim Start einmal durchgeführte Funktionen!
	**************************************************************************************/

	initialize()

	active_addon_func(true)

	checkjsons()

	if (!(workspace.workspaceFolders?.toString)) {
		openprefolder()
	}

	/**************************************************************************************
	Funktionen, die immer wieder aufgerufen werden können, je nach Event
	**************************************************************************************/

	const eventHandler_checkname = async () => {
		if (active_addon) {
			await checkname()
		}
	}
	workspace.onDidSaveTextDocument(eventHandler_checkname)
	debug.onDidChangeBreakpoints(eventHandler_checkname)

	constregistercommands.forEach(command => {
		context.subscriptions.push(commands.registerCommand(command.name, command.callback));
	})

}

async function initialize() {
	try {
		const settings = require('./extsettings');
		// Initialize your extension using the settings from extsettings.ts
	} catch (error) {
		console.error(error);
		// Wait for a second before trying again
		await new Promise(resolve => setTimeout(resolve, 1000));
		// Try initializing again
		await initialize();
	}
}

export function deactivate() { }
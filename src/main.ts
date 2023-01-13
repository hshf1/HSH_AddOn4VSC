import { ExtensionContext, commands, workspace, debug, window } from 'vscode'
import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { active_addon, active_addon_func } from './status_bar'
import { constregistercommands } from './registercommands'
import { setting_init } from './extsettings'
import { github_status } from './github'

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

	workspace.onDidChangeConfiguration(event => {
		commands.executeCommand('workbench.action.closeActiveEditor')
		commands.executeCommand('workbench.action.reloadWindow');
	});

	const eventHandler_checkname = async () => {
		if (active_addon) {
			await checkname()
		}
	}
	workspace.onDidSaveTextDocument(eventHandler_checkname)
	debug.onDidChangeBreakpoints(eventHandler_checkname)

	constregistercommands.forEach(command => {
		context.subscriptions.push(commands.registerCommand(command.name, command.callback))
	})

}

async function initialize() {
	let init_status: boolean | undefined = undefined
	try {
		await require('./extsettings')
		await require('./github')
		// Initialize your extension using the settings from extsettings.ts
	} catch (error) {
		console.error(error);
		// Wait for a second before trying again
		await new Promise(resolve => setTimeout(resolve, 1000))
		// Try initializing again
		await initialize()
	}
	while (init_status === undefined) {
		if (setting_init !== undefined && github_status !== undefined) {
			if (setting_init === false) {
				window.showWarningMessage('Einstellungen konnten nicht richtig initialisiert werden. Bei Problem VSCode neu starten.')
			}
			if (github_status === false) {
				window.showWarningMessage('GitHub Einstellungen konnten nicht richtig initialisiert werden. Bei Problem VSCode neu starten.')
			}
			init_status = true
		}
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

export function deactivate() { }
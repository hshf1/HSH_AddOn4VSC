import { ExtensionContext, commands, workspace, debug, window } from 'vscode'

import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { constregistercommands } from './registercommands'
import { computerraum_hsh, setting_init, statusbar_button } from './init'
import { github_status } from './github'

export function activate(context: ExtensionContext) {

	/**************************************************************************************
	Beim Start einmal durchgeführte Funktionen!
	**************************************************************************************/

	initialize()

	checkjsons()

	if (!(workspace.workspaceFolders?.toString)) {
		openprefolder()
	}

	/**************************************************************************************
	Funktionen, die immer wieder aufgerufen werden können, je nach Event
	**************************************************************************************/

	workspace.onDidChangeConfiguration(event => {
		if (!computerraum_hsh && workspace.getConfiguration('addon4vsc').get('computerraum') || computerraum_hsh && !workspace.getConfiguration('addon4vsc').get('computerraum')) {
			commands.executeCommand('workbench.action.closeActiveEditor')
			commands.executeCommand('workbench.action.reloadWindow')
		}
	})

	const eventHandler_checkname = async () => {
		if (statusbar_button.command === 'extension.off') {
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
		await require('./init')
		await require('./github')
	} catch (error) {
		console.error(error);
		await new Promise(resolve => setTimeout(resolve, 1000))
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
import { ExtensionContext, commands, workspace, debug, window, ConfigurationChangeEvent } from 'vscode'

import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { getCommands } from './registercommands'
import { hshRZ, getOS, sethshRZ, setPath, setting_init, getStatusBarItem, initMain } from './init'
import { getGithubStatus } from './github'
import { constcommands } from './constants'

export async function activate(context: ExtensionContext) {

	initMain()

	checkjsons()

	if (!(workspace.workspaceFolders?.toString)) {
		openprefolder()
	}

	const eventHandler_checkname = async () => {
		if (getStatusBarItem().command === 'extension.off') {
			await checkname()
		}
	}
	workspace.onDidSaveTextDocument(eventHandler_checkname)
	debug.onDidChangeBreakpoints(eventHandler_checkname)
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		if (event.affectsConfiguration('addon4vsc.computerraum')) {
			if (getOS('WIN')) {
				let temp_hshRZ: boolean | undefined = undefined
				while(temp_hshRZ === undefined) {
					temp_hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
				}
				if (temp_hshRZ != hshRZ) {
					sethshRZ(temp_hshRZ)
					setPath()
					commands.executeCommand(constcommands[3].command)
				}
			}
		}
	})

	getCommands().forEach(command => {
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
		if (setting_init !== undefined && getGithubStatus() !== undefined) {
			if (setting_init === false) {
				window.showWarningMessage('Einstellungen konnten nicht richtig initialisiert werden. Bei Problem VSCode neu starten.')
			}
			if (getGithubStatus() === false) {
				window.showWarningMessage(`Nützliche Links aus GitHub konnten nicht geladen werden. Bei Bedarf Internetverbindung prüfen und VSCode neu starten.`)
			}
			init_status = true
		}
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

export function deactivate() { }
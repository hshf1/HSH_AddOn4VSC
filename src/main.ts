import * as vscode from 'vscode'
import { dirname } from 'path'
import { IS_WINDOWS, menue_button } from './extsettings'
import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { active_addon, menue } from './menue'

export function activate(context: vscode.ExtensionContext) {

	/**************************************************************************************
	Beim Start einmal durchgeführte Funktionen!
	**************************************************************************************/

	const extpath = context.extensionPath
	const username_from_extpath = dirname(dirname(dirname(extpath)))

	if (!IS_WINDOWS) {
		if (!vscode.extensions.getExtension('vadimcn.vscode-lldb')) {
			vscode.commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
		}
	}

	checkjsons(username_from_extpath)

	if (!(vscode.workspace.workspaceFolders?.toString)) {
		openprefolder(username_from_extpath)
	}

	/**************************************************************************************
	Funktionen, die immer wieder aufgerufen werden können, je nach Event
	**************************************************************************************/

	vscode.workspace.onDidSaveTextDocument(async () => {
		if (active_addon) {
			await checkname()
		}
	})

	vscode.debug.onDidChangeBreakpoints(async () => {
		if (active_addon) {
			await checkname()
		}
	})

	context.subscriptions.push(
		vscode.commands.registerCommand('menue.show', () => {
			menue()
			menue_button.hide()
		})
	)
}

export function deactivate() { }
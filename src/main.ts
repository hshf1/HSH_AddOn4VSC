import * as vscode from 'vscode'
import * as path from 'path'
import { IS_LINUX, IS_OSX } from './extsettings'
import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { startQuiz } from './quiz'

export function activate(context: vscode.ExtensionContext) {

	/**************************************************************************************
	Beim Start einmal durchgeführte Funktionen!
	**************************************************************************************/

	// Pfaderstellung für alle weiteren Befehle
	const extpath = context.extensionPath
	const username_from_extpath = path.dirname(path.dirname(path.dirname(extpath)))

	// Für MacOS und Linux benötigte Erweiterung für den Compiler
	if (IS_LINUX || IS_OSX) {
		if (!vscode.extensions.getExtension('vadimcn.vscode-lldb')) {
			vscode.commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
		}
	}

	// settings/tasks/launch-.json überprüfen und einfügen
	checkjsons(username_from_extpath)

	// vordefinierten Ordner öffnen, falls gefunden, sonst auffordern
	if (!(vscode.workspace.workspaceFolders?.toString)) {
		openprefolder(username_from_extpath)
	}

	/**************************************************************************************
	Funktionen, die immer wieder aufgerufen werden können, je nach Event
	**************************************************************************************/

	// Datei- und Ordnernamen nach Umlauten oder Leerzeichen prüfen
	vscode.workspace.onDidSaveTextDocument(async () => {
		await checkname()
	})
	vscode.debug.onDidChangeBreakpoints(async () => {
		await checkname()
	})

	// C-Quiz starten
	context.subscriptions.push(
		vscode.commands.registerCommand('exam.start', () => {
			startQuiz()
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() { }
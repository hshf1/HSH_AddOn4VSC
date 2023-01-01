import * as vscode from 'vscode'
import { IS_WINDOWS, testprogc } from './extsettings'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

function openfolder() {
	const options: vscode.OpenDialogOptions = {
		canSelectMany: false,
		openLabel: 'Ordner öffnen',
		canSelectFiles: false,
		canSelectFolders: true,
	};
	vscode.window.showOpenDialog(options).then(fileUri => {
		if (fileUri && fileUri[0]) {
			console.log('Ausgewählter Ordner: ' + fileUri[0].fsPath);
			vscode.commands.executeCommand(`vscode.openFolder`, fileUri[0]);
		}
	})
}

export function openprefolder(username_from_extpath: string) {
	var folderPath = '/Documents/C_Uebung'
	if (IS_WINDOWS) {
		folderPath = '\\Documents\\C_Uebung'
	}
	const folderPathParsed = folderPath.split(`\\`).join(`/`)
	const testprogfilepath = username_from_extpath + folderPathParsed + '/testprog.c'
	const folderUri = vscode.Uri.file(username_from_extpath + folderPathParsed)
	console.log(`folderUri: ${folderUri}`)
	if (!existsSync(username_from_extpath + folderPathParsed)) {
		try {
			mkdirSync(username_from_extpath + folderPathParsed)
		} catch (error) {
			console.error(error)
		}
	}
	if (!existsSync(testprogfilepath)) {
		try {
			writeFileSync(testprogfilepath, testprogc)
		} catch (error) {
			console.error(error)
		}
	}
	if (existsSync(username_from_extpath + folderPathParsed)) {
		vscode.commands.executeCommand(`vscode.openFolder`, folderUri)
	} else {
		openfolder()
	}
}
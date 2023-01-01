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

export function checkfilefoldername() {
	var filePath = vscode.window.activeTextEditor?.document.uri.fsPath || "no_file_defined"
	var filePathlowercase = filePath.toLowerCase()
	console.log(filePath)
	if (filePathlowercase.indexOf('ä') !== -1 || filePathlowercase.indexOf('ö') !== -1 || filePathlowercase.indexOf('ü') !== -1 || filePathlowercase.indexOf(' ') !== -1) {
		vscode.window.showErrorMessage(`${filePath} beinhaltet Umlaute oder Leerzeichen!`)
	}
	if (!filePath.endsWith('.c')) {
		vscode.window.showErrorMessage(`${filePath} endet nicht mit ".c"! Für das Compilieren muss die Datei mit ".c" enden!`)
	}
}
import { Uri, OpenDialogOptions, commands, window } from 'vscode'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { filePath_testprog, folderPath_C_Uebung } from './init'
import { testprogc } from './constants'

function openfolder() {
	const options: OpenDialogOptions = {
		canSelectMany: false,
		openLabel: 'Ordner öffnen',
		canSelectFiles: false,
		canSelectFolders: true,
	}

	window.showOpenDialog(options).then(fileUri => {
		if (fileUri && fileUri[0]) {
			console.log('Ausgewählter Ordner: ' + fileUri[0].fsPath);
			commands.executeCommand(`vscode.openFolder`, fileUri[0]);
		}
	})
}

export async function openprefolder() {
	const folderUri = Uri.file(folderPath_C_Uebung)
	
	if (!existsSync(folderPath_C_Uebung)) {
		try {
			mkdirSync(folderPath_C_Uebung)
		} catch (error) {
			console.error(error)
		}
	}
	if (!existsSync(filePath_testprog)) {
		try {
			writeFileSync(filePath_testprog, testprogc)
		} catch (error) {
			console.error(error)
		}
	}
	if (existsSync(folderPath_C_Uebung)) {
		commands.executeCommand(`vscode.openFolder`, folderUri)
	} else {
		openfolder()
	}
}
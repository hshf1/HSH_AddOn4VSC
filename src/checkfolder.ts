import { Uri, OpenDialogOptions, commands, window } from 'vscode'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { getPath } from './init'
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
	const folderUri = Uri.file(getPath('CUebung'))
	
	if (!existsSync(getPath('CUebung'))) {
		try {
			mkdirSync(getPath('CUebung'))
		} catch (error) {
			console.error(error)
		}
	}
	if (!existsSync(getPath('testprog'))) {
		try {
			writeFileSync(getPath('testprog'), testprogc)
		} catch (error) {
			console.error(error)
		}
	}
	if (existsSync(getPath('CUebung'))) {
		commands.executeCommand(`vscode.openFolder`, folderUri)
	} else {
		openfolder()
	}
}
import { Uri, OpenDialogOptions, commands, window } from 'vscode'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { enableFeature, filePath_testprog, folderPath_C_Uebung, IS_WINDOWS } from './init'
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
	let selectedOption: boolean = false
	if (IS_WINDOWS && !enableFeature && existsSync('U:\\')) {
		window.showErrorMessage('Wird VSCode im RZ der Hochschule Hannover gestartet?', 'VSCode wird im RZ der Hochschule Hannover gestartet', 'Nein').then(async selected => {
			if (selected === 'VSCode wird im RZ der Hochschule Hannover gestartet') {
				commands.executeCommand('workbench.action.openSettings', 'addon4vsc.computerraum')
				while (!enableFeature) {
					await new Promise(resolve => setTimeout(resolve, 1000))
				}
				selectedOption = true
				return
			} else if (selected === 'Nein') {
				selectedOption = true
			}
		})
		while (!selectedOption) {
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
	}
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
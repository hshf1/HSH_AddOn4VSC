import { Uri, OpenDialogOptions, commands, window } from 'vscode';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { getPath } from './init/paths';
import { getTestProg } from './constants';
import { writeLog } from './logfile';

function openFolder(): void {
	const options: OpenDialogOptions = {
		canSelectMany: false,
		openLabel: 'Ordner öffnen',
		canSelectFiles: false,
		canSelectFolders: true
	};

	window.showOpenDialog(options).then(fileUri => {
		if (fileUri && fileUri[0]) {
			writeLog('Ausgewählter Ordner: ' + fileUri[0].fsPath, 'INFO');
			commands.executeCommand(`vscode.openFolder`, fileUri[0]);
		}
	});
}

export function openPreFolder(): void {
	const uebungsFolder = getPath().uebungsFolder;
	const testProg = getPath().testProgFile;
	const folderUri = Uri.file(uebungsFolder);

	if (!existsSync(uebungsFolder)) {
		try {
			mkdirSync(uebungsFolder);
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
		}
	}

	if (!existsSync(testProg)) {
		try {
			writeFileSync(testProg, getTestProg());
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
		}
	}

	if (existsSync(uebungsFolder)) {
		commands.executeCommand(`vscode.openFolder`, folderUri);
	} else {
		openFolder();
	}
}
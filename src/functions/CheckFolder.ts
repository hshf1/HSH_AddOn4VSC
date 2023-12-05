import { Uri, OpenDialogOptions, commands, window, workspace } from 'vscode';
import { existsSync } from 'fs';
import { dirname } from 'path';

import { getPath } from './Paths';
import { writeLog } from './LogFile';
import { errorNotification } from './Notifications';

let varInitFolder = false;

export function initFolder() {
	const openWorkspace = workspace.workspaceFolders?.toString() || '';
	const openFile = window.activeTextEditor?.document.uri;

	if (!(openWorkspace) && !varInitFolder) {
		if ((openFile)) {
			openFileFolder(openFile);
		} else {
			openPreFolder();
		}
	}

	varInitFolder = true;
}

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

function openPreFolder(): void {
	const uebungsFolder = getPath().hshMainUserFolder;
	const folderUri = Uri.file(uebungsFolder);

	if (existsSync(uebungsFolder)) {
		commands.executeCommand(`vscode.openFolder`, folderUri);
	} else {
		openFolder();
	}
}

function openFileFolder(openFile: Uri): void {
	const dirFileFolder = Uri.file(dirname(openFile.path));

	try {
		commands.executeCommand(`vscode.openFolder`, dirFileFolder);
	} catch (error) {
		errorNotification(`Fehler bei Funktion openFileFolder: ${error}`);
	}
}
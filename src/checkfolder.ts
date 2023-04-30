/** Dieses Modul stellt die Funktionen zur Verfügung, um in VS Code einen Ordner zu öffnen und einen vordefinierten Ordner zu erstellen, falls dieser noch nicht existiert. */

import { Uri, OpenDialogOptions, commands, window } from 'vscode' /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { existsSync, mkdirSync, writeFileSync } from 'fs'	/** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getPath } from './init' /** Importiert die Funktion die verschiedene Pfade zurückgibt aus init.ts  */
import { getTestProg } from './constants' /** Importiert den Inhalt des testprogramms aus constants.ts */
import { writeLog } from './logfile'

function openFolder() {
	const options: OpenDialogOptions = { /** Übernimmt die Einstellungen für das Dialog Fenster in dem der Ordner ausgewählt werden kann */
		canSelectMany: false,
		openLabel: 'Ordner öffnen',
		canSelectFiles: false,
		canSelectFolders: true
	}

	window.showOpenDialog(options).then(fileUri => {	/** Erstellt Fenster in dem ein Ordner ausgewählt werden kann */
		if (fileUri && fileUri[0]) {
			writeLog('Ausgewählter Ordner: ' + fileUri[0].fsPath, 'INFO')	/** Gibt den Ordnerpfad in der Konsole aus */
			commands.executeCommand(`vscode.openFolder`, fileUri[0])	/** Öffnet den Ordner */
		}
	})
}

/** Öffnet/Erstellt Ordner Verzeichnis */
export function openPreFolder() {
	const uebungsFolder = getPath('uebungfolder')
	const testProg = getPath('testprog')
	const folderUri = Uri.file(uebungsFolder) /** Kopiert den Pfad des CUebungs Ordners in eine Konstante */

	if (!existsSync(uebungsFolder)) {	/** Überprüft ob der Pfad inklusive des Ordners noch nicht existiert */
		try {
			mkdirSync(uebungsFolder)	/** Versucht CUebung zu erstellen */
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')	/** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (!existsSync(testProg)) { /** Überprüft ob der Pfad inklusive der Datei noch nicht existiert */
		try {
			writeFileSync(testProg, getTestProg()) /** Erstellt das testprog und schreibt den inhalt aus constants.ts hinein*/ 
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR') /** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (existsSync(uebungsFolder)) {	/** Überprüft ob der Pfad inklusive des Ordners schon existiert */
		commands.executeCommand(`vscode.openFolder`, folderUri) /** VSCode Befehl der einen Ordner öffnet, übergeben wird der Pfad des Übungsordners  */
	} else {
		openFolder()	/** Ruft Funktion auf die den Nutzer einen Ordner auswählen lässt */
	}
}
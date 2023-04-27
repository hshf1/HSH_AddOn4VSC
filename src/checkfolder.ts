/** Dieses Modul stellt die Funktionen zur Verfügung, um in VS Code einen Ordner zu öffnen und einen vordefinierten Ordner zu erstellen, falls dieser noch nicht existiert. */


import { Uri, OpenDialogOptions, commands, window } from 'vscode' /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { existsSync, mkdirSync, writeFileSync } from 'fs'	/** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getPath } from './init' /** Importiert die Funktion die verschiedene Pfade zurückgibt aus init.ts  */
import { getTestProgC, testprogjava, testprogpython } from './constants' /** Importiert den Inhalt des testprogramms aus constants.ts */
import { writeLog } from './logfile'

function openfolder() {
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

export async function openprefolder(temp_Folder: String) { /** Öffnet/Erstellt Ordner Verzeichnis, braucht als eingabe die Prog.Sprache */
	let folder_path = "";
	let prog_path = "";
	let programm = "";

	if (temp_Folder == "C") { /** Speichert die relevanten Daten in Variablen */

		folder_path = getPath('cuebung')
		prog_path = getPath('testprogc')
		programm = getTestProgC()

	} else if (temp_Folder == "Java") {

		folder_path = getPath('JavaUebung')
		prog_path = getPath('testprogjava')
		programm = testprogjava
		
	} else if (temp_Folder == "Python") {

		folder_path = getPath('PythonUebung')
		prog_path = getPath('testprogpython')
		programm = testprogpython
		
	}

	const folderUri = Uri.file(folder_path) /** Kopiert den Pfad des CUebungs Ordners in eine Konstante */

	if (!existsSync(folder_path)) {	/** Überprüft ob der Pfad inklusive des Ordners noch nicht existiert */
		try {
			mkdirSync(getPath('cuebung'))	/** Versucht CUebung zu erstellen */
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')	/** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (!existsSync(prog_path)) {	/** Überprüft ob der Pfad inklusive der Datei noch nicht existiert */
		try {
			writeFileSync(getPath('testprog'), programm) /** Erstellt das testprog und schreibt den inhalt aus constants.ts hinein*/ 
		} catch (error: any) {
			writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR') /** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (existsSync(folder_path)) {	/** Überprüft ob der Pfad inklusive des Ordners schon existiert */
		commands.executeCommand(`vscode.openFolder`, folderUri) /** VSCode Befehl der einen Ordner öffnet, übergeben wird der Pfad des Übungsordners  */
	} else {
		openfolder()	/** Ruft Funktion auf die den Nutzer einen Ordner auswählen lässt */
	}
}
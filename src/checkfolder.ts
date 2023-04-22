/** Dieses Modul stellt die Funktionen zur Verfügung, um in VS Code einen Ordner zu öffnen und einen vordefinierten Ordner zu erstellen, falls dieser noch nicht existiert. */


import { Uri, OpenDialogOptions, commands, window } from 'vscode' /** Importiert die genannten Befehle aus der VS-Code Erweiterung */
import { existsSync, mkdirSync, writeFileSync } from 'fs'	/** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getPath } from './init' /** Importiert die Funktion die verschiedene Pfade zurückgibt aus init.ts  */
import { testprogc } from './constants' /** Impoertiert den Inhalt des testprogramms aus constants.ts */

function openfolder() {
	const options: OpenDialogOptions = { /** Übernimmt die Einstellungen für das Dialog Fenster in dem der Ordner ausgewählt werden kann */
		canSelectMany: false,
		openLabel: 'Ordner öffnen',
		canSelectFiles: false,
		canSelectFolders: true,
	}

	window.showOpenDialog(options).then(fileUri => {	/** Erstellt Fenster in dem ein Ordner ausgewählt werden kann */
		if (fileUri && fileUri[0]) {
			console.log('Ausgewählter Ordner: ' + fileUri[0].fsPath);	/** Gibt den Ordnerpfad in der Konsole aus */
			commands.executeCommand(`vscode.openFolder`, fileUri[0]);	/** Öffnet den Ordner */
		}
	})
}

export async function openprefolder() {
	const folderUri = Uri.file(getPath('CUebung')) /** Kopiert den Pfad des CUebungs Ordners in eine Konstante */
	
	if (!existsSync(getPath('CUebung'))) {	/** Überprüft ob der Pfad inklusive des Ordners noch nicht existiert */
		try {
			mkdirSync(getPath('CUebung'))	/** Verucht CUebung zu erstellen */
		} catch (error) {
			console.error(error)	/** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (!existsSync(getPath('testprog'))) {	/** Überprüft ob der Pfad inklusive der Datei noch nicht existiert */
		try {
			writeFileSync(getPath('testprog'), testprogc) /** Erstellt das testprog und schreibt den inhalt aus constants.ts hinein*/ 
		} catch (error) {
			console.error(error) /** Falls ein Fehler entsteht wird dieser in die Konsole geschrieben */
		}
	}
	if (existsSync(getPath('CUebung'))) {	/** Überprüft ob der Pfad inklusive des Ordners schon existiert */
		commands.executeCommand(`vscode.openFolder`, folderUri) /** VSCode Befehl der einen Ordner öffnet, übergeben wird der Pfad des Übungsordners  */
	} else {
		openfolder()	/** Ruft Funktion auf die den Nutzer einen Ordner auswählen lässt */
	}
}
/** Dieses Modul enthält Funktionen zum Verwalten der JSON-Dateien */

import { promises, unlinkSync } from 'fs' /** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getSettingsJsonData, getTasksJsonData } from './constants'	/** Importiert den Inhalt der Jsons aus dem Modul constants.ts */
import { getPath } from './init' /** Importiert die Funktion die Pfade für .JSON und den Ordner + Bsp. Prog.  */

export async function renewjsons(filePath_todelete: string) { /** Funktion die die settings.json und task.json aktualisiert */
	try {
		unlinkSync(filePath_todelete)	/** Versucht den Pfad der zu löschenden Datei zu finden*/
	} catch (err: any) {				/** Bei Fehler, werden Fehlermeldungen ausgegeben */
		if (err.code === 'ENOENT') {
			console.error(`Datei existiert nicht: ${filePath_todelete}`)
		} else {
			console.error(`Ein Problem ist beim löschen der Datei aufgetreten: ${filePath_todelete}`)
			console.error(err)
		}
	}
	if (filePath_todelete.includes("settings")) { /** Wenn der Dateipfad "settings" enthält soll die settings.json erneuert werden */
		await setsettingsjson()
	} else if (filePath_todelete.includes("tasks")) {	/** Wenn der Dateipfad "tasks" enthält soll die task.json erneurt werden */
		await settasksjson()
	}
}

export async function checkjsons() {	/** Funktion überprüft ob die beiden .jsons vorhanden sind und fügt ggf. neu hinzu */
	try {
		await promises.stat(getPath('settingsjson')) /** Überprüft ob Datei vorhanden ist */
	} catch {
		await setsettingsjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
	try {
		await promises.stat(getPath('tasksjson'))	/** Überprüft ob Datei vorhanden ist */
	} catch {
		await settasksjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
}

async function setsettingsjson() { /** Funktion die settings.json erstellt oder aktualisiert */
	try {
		await promises.writeFile(getPath('settingsjson'), getSettingsJsonData()) /**Erstellt die settings.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err) {
		console.error(err)	/** Falls Fehler auftritt wird Fehler ausgegeben */
	}
}

async function settasksjson() {
	try {
		await promises.writeFile(getPath('tasksjson'), getTasksJsonData())	/**Erstellt die tasks.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err) {
		console.error(err) /** Falls Fehler auftritt wird Fehler ausgegeben */
	}
}
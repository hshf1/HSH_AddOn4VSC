/** Dieses Modul enthält Funktionen zum Verwalten der JSON-Dateien */

import { promises, unlinkSync } from 'fs' /** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getSettingsContent, getTasksContent } from './constants'	/** Importiert den Inhalt der Jsons aus dem Modul constants.ts */
import { getPath } from './init' /** Importiert die Funktion die Pfade für .JSON und den Ordner + Bsp. Prog.  */
import { writeLog } from './logfile'

/** Funktion die die settings.json und task.json aktualisiert */
export function updateJSON(path: string) {
	try {
		unlinkSync(path)	/** Versucht den Pfad der zu löschenden Datei zu finden*/
	} catch (err: any) {				/** Bei Fehler, werden Fehlermeldungen ausgegeben */
		if (err.code === 'ENOENT') {
			writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${path} ${err}`, 'ERROR')
		} else {
			writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${path} ${err}`, 'ERROR')
		}
	} finally {
		if (path.includes("settings")) { /** Wenn der Dateipfad "settings" enthält soll die settings.json erneuert werden */
			setsettingsjson()
		} else if (path.includes("tasks")) {	/** Wenn der Dateipfad "tasks" enthält soll die task.json erneurt werden */
			settasksjson()
		}
		writeLog(`${path} wurde erfolgreich gelöscht!`, 'INFO')
	}
}

/** Funktion überprüft ob die beiden .jsons vorhanden sind und fügt ggf. neu hinzu */
export function checkJSON() {
	try {
		promises.stat(getPath('settingsjson')) /** Überprüft ob Datei vorhanden ist */
	} catch {
		writeLog(`${getPath('settingsjson')} wurde nicht gefunden.`, 'WARNING')
		setsettingsjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	} finally {
		writeLog(`${getPath('settingsjson')} wurde gefunden.`, 'WARNING')
	}
	try {
		promises.stat(getPath('tasksjson'))	/** Überprüft ob Datei vorhanden ist */
	} catch {
		writeLog(`${getPath('tasksjson')} wurde nicht gefunden.`, 'WARNING')
		settasksjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	} finally {
		writeLog(`${getPath('tasksjson')} wurde gefunden.`, 'WARNING')
	}
}

/** Funktion die settings.json erstellt oder aktualisiert */
function setsettingsjson() {
	const CONTENT = getSettingsContent()
	const PATH = getPath('settingsjson')

	try {
		promises.writeFile(PATH, CONTENT) /**Erstellt die settings.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
	} finally {
		writeLog(`${getPath('settingsjson')} wurde erfolgreich erstellt.`, 'INFO')
	}
}

function settasksjson() {
	const CONTENT = getTasksContent()
	const PATH = getPath('tasksjson')

	try {
		promises.writeFile(PATH, CONTENT) /**Erstellt die tasks.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR') /** Falls Fehler auftritt wird Fehler ausgegeben */
	} finally {
		writeLog(`${getPath('tasksjson')} wurde erfolgreich erstellt.`, 'INFO')
	}
}
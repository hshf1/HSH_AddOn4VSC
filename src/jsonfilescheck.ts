/** Dieses Modul enthält Funktionen zum Verwalten der JSON-Dateien */

import { promises, writeFileSync } from 'fs' /** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getSettingsContent, getTasksContent } from './constants'	/** Importiert den Inhalt der Jsons aus dem Modul constants.ts */
import { getPath } from './init' /** Importiert die Funktion die Pfade für .JSON und den Ordner + Bsp. Prog.  */
import { writeLog } from './logfile'

/** Funktion überprüft ob die beiden .jsons vorhanden sind und fügt ggf. neu hinzu */
export function checkJSON() {
	try {
		promises.stat(getPath('settingsjson')) /** Überprüft ob Datei vorhanden ist */
		writeLog(`${getPath('settingsjson')} wurde gefunden.`, 'INFO')
	} catch {
		writeLog(`${getPath('settingsjson')} wurde nicht gefunden.`, 'WARNING')
		setsettingsjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
	try {
		promises.stat(getPath('tasksjson'))	/** Überprüft ob Datei vorhanden ist */
		writeLog(`${getPath('tasksjson')} wurde gefunden.`, 'INFO')
	} catch {
		writeLog(`${getPath('tasksjson')} wurde nicht gefunden.`, 'WARNING')
		settasksjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
}

/** Funktion die settings.json erstellt oder aktualisiert */
export function setsettingsjson() {
	const CONTENT = getSettingsContent()
	const PATH = getPath('settingsjson')

	try {
		writeFileSync(PATH, CONTENT, { flag: 'w' }) /**Erstellt die settings.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
	} finally {
		writeLog(`${getPath('settingsjson')} wurde erfolgreich erstellt.`, 'INFO')
	}
}

export function settasksjson() {
	const PATH = getPath('tasksjson')
	const CONTENT = getTasksContent()
	const callStack = new Error().stack
  	console.log(`settasksjson was called from ${callStack}`)
	try {
		writeFileSync(PATH, CONTENT, { flag: 'w' }) /**Erstellt die tasks.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
		writeLog(`${getPath('tasksjson')} wurde erfolgreich erstellt.`, 'INFO')
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR') /** Falls Fehler auftritt wird Fehler ausgegeben */
	}
}

/** Dieses Modul enthält Funktionen zum Verwalten der JSON-Dateien */
import { statSync, writeFileSync } from 'fs' /** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getSettingsContent, getTasksContent } from './constants' /** Importiert den Inhalt der Jsons aus dem Modul constants.ts */
import { getPath } from './init/paths' /** Importiert die Funktion die Pfade für .JSON und den Ordner + Bsp. Prog.  */
import { writeLog } from './logfile'
import { join } from 'path'

/** Funktion überprüft ob die beiden .jsons vorhanden sind und fügt ggf. neu hinzu */
export function checkJSON() {
	const SETTINGSJSON = join(getPath().vscUserData, 'settings.json')
	const TASKSJSON = join(getPath().vscUserData, 'tasks.json')

	try {
		statSync(SETTINGSJSON) /** Überprüft ob Datei vorhanden ist */
		writeLog(`${SETTINGSJSON} wurde gefunden.`, 'INFO')
	} catch (error) {
		writeLog(`${SETTINGSJSON} wurde nicht gefunden.`, 'WARNING')
		setsettingsjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
	try {
		statSync(TASKSJSON)	/** Überprüft ob Datei vorhanden ist */
		writeLog(`${TASKSJSON} wurde gefunden.`, 'INFO')
	} catch (error) {
		writeLog(`${TASKSJSON} wurde nicht gefunden.`, 'WARNING')
		settasksjson()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
}

/** Funktion die settings.json erstellt oder aktualisiert */
export function setsettingsjson() {
	const CONTENT = getSettingsContent()
	const PATH = join(getPath().vscUserData, 'settings.json')

	try {
		writeFileSync(PATH, CONTENT, { flag: 'w' }) /**Erstellt die settings.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
	} finally {
		writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO')
	}
}

export function settasksjson() {
	const PATH = join(getPath().vscUserData, 'tasks.json')
	const CONTENT = getTasksContent()

	try {
		writeFileSync(PATH, CONTENT, { flag: 'w' }) /**Erstellt die tasks.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
		writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO')
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR') /** Falls Fehler auftritt wird Fehler ausgegeben */
	}
}
/** Dieses Modul enthält Funktionen zum Verwalten der JSON-Dateien */
import { copyFileSync, existsSync, statSync, unlinkSync, writeFileSync } from 'fs' /** Importiert Funktionen zum Arbeiten mit Dateien (Filesystem) aus node.js*/

import { getPath } from '../init/paths' /** Importiert die Funktion die Pfade für .JSON und den Ordner + Bsp. Prog.  */
import { writeLog } from '../logfile'
import { join } from 'path'

/** Funktion überprüft ob die beiden .jsons vorhanden sind und fügt ggf. neu hinzu */
function checkTasksFile() {
	const TASKSJSON = join(getPath().vscUserData, 'tasks.json')

	try {
		statSync(TASKSJSON)	/** Überprüft ob Datei vorhanden ist */
		writeLog(`${TASKSJSON} wurde gefunden.`, 'INFO')
	} catch (error) {
		writeLog(`${TASKSJSON} wurde nicht gefunden.`, 'WARNING')
		setTasksFile()	/** Falls Fehler auftritt, sie also nicht vorhanden ist, wird sie neu erstellt */
	}
}

export function setTasksFile() {
	const PATH = join(getPath().vscUserData, 'tasks.json')
	const CONTENT = getTasksContent()
	createTasksBackup()

	try {
		writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' }) /**Erstellt die tasks.json in dem Pfad von getPath() und mit dem Inhalt aus constants.ts */
		writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO')
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR') /** Falls Fehler auftritt wird Fehler ausgegeben */
	}
}

function getTasksContent() {
	return {

	}
}

function createTasksBackup() {
    const TASKSSPATH: string = join(getPath().vscUserData, 'tasks.json');
    const OLDTASKSPATH: string = join(getPath().vscUserData, 'old_tasks.json');

    try {
        if (existsSync(TASKSSPATH)) {
            // The settings.json file exists
    
            // Create a backup copy of existing settings
            if (existsSync(OLDTASKSPATH)) {
                unlinkSync(OLDTASKSPATH);
            }
            copyFileSync(TASKSSPATH, OLDTASKSPATH);
        }
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')	/** Falls Fehler auftritt wird Fehler ausgegeben */
    }
}
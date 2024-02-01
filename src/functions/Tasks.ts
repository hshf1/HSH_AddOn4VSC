import { copyFileSync, existsSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { getPath } from './Paths';
import { OS, getOSBoolean } from './OS';
import { errorNotification, infoNotification, warningNotification } from './Notifications';
import { tasksLinux, tasksMac, tasksWindows } from '../constants/Tasks';

export function checkTasksFile(): void {
	const TASKSJSON = join(getPath().vscUserData, 'tasks.json');

	try {
		statSync(TASKSJSON);
		infoNotification(`${TASKSJSON} wurde gefunden.`);
		//setTaskOnce();
	} catch (error) {
		warningNotification(`${TASKSJSON} wurde nicht gefunden.`);
		setTasksFile();
	}
}

export function setTasksFile(): void {
	const PATH = join(getPath().vscUserData, 'tasks.json');
	const CONTENT = getTasksContent();

	createTasksBackup();

	try {
		writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' });
		infoNotification(`${PATH} wurde erfolgreich erstellt.`, true);
	} catch (err: any) {
		errorNotification(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`);
	}
}

function getTasksContent() {
	const tasks = getOSBoolean(OS.windows) ? tasksWindows : getOSBoolean(OS.macOS) ? tasksMac : tasksLinux;

	return {
		"version": "2.0.0",
		tasks
	};
}

function createTasksBackup(): void {
	const TASKSSPATH: string = join(getPath().vscUserData, 'tasks.json');
	const OLDTASKSPATH: string = join(getPath().tempAddOn, 'old_tasks.json');

	try {
		if (existsSync(TASKSSPATH)) {
			if (existsSync(OLDTASKSPATH)) {
				unlinkSync(OLDTASKSPATH);
			}
			copyFileSync(TASKSSPATH, OLDTASKSPATH);
		}
	} catch (error: any) {
		errorNotification(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`);
	}
}

function setTaskOnce(): void {
	const fileName = 'v2_0_0_setTaskOnce.txt';
	const tempAddOnPath = join(getPath().tempAddOn, fileName);

	try {
		if (existsSync(tempAddOnPath)) {
			return;
		} else {
			writeFileSync(tempAddOnPath, '');
			infoNotification(`${fileName} existiert noch nicht, tasks.json wird überschrieben!`);
			setTasksFile();
		}
	} catch (error) {
		errorNotification(`Fehler: ${error}`);
	}
}
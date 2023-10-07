import { copyFileSync, existsSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { getPath } from '../init/paths';
import { writeLog } from '../logfile';

export function checkTasksFile(): void {
	const TASKSJSON = join(getPath().vscUserData, 'tasks.json');

	try {
		statSync(TASKSJSON);
		writeLog(`${TASKSJSON} wurde gefunden.`, 'INFO');
	} catch (error) {
		writeLog(`${TASKSJSON} wurde nicht gefunden.`, 'WARNING');
		setTasksFile();
	}
}

export function setTasksFile(): void {
	const PATH = join(getPath().vscUserData, 'tasks.json');
	const CONTENT = getTasksContent();

	createTasksBackup();

	try {
		writeFileSync(PATH, JSON.stringify(CONTENT, null, 4), { flag: 'w' });
		writeLog(`${PATH} wurde erfolgreich erstellt.`, 'INFO');
	} catch (err: any) {
		writeLog(`[${err.stack?.split('\n')[2]?.trim()}] ${err}`, 'ERROR');
	}
}

function getTasksContent() {
	return {
		"version": "2.0.0",
		"tasks": [
			{
				"type": "cppbuild",
				"label": "C/C++: gcc Aktive Datei kompilieren",
				"command": "/usr/bin/gcc",
				"args": [
					"-g",
					"\${file}",
					"-o",
					"\${fileDirname}/\${fileBasenameNoExtension}"
				],
				"options": {
					"cwd": "\${fileDirname}"
				},
				"problemMatcher": [
					"$gcc"
				],
				"group": {
					"kind": "build",
					"isDefault": true
				},
				"detail": "Vom Debugger generierte Aufgabe."
			},
			{
				"type": "cppbuild",
				"label": "C/C++: gcc.exe Aktive Datei kompilieren",
				"command": "gcc.exe",
				"args": [
					"-g",
					"\${file}",
					"-o",
					"\${fileDirname}\\\\\${fileBasenameNoExtension}.exe"
				],
				"options": {
					"cwd": "\${workspaceFolder}"
				},
				"problemMatcher": [
					"$gcc"
				],
				"group": {
					"kind": "build",
					"isDefault": true
				},
				"detail": "Compiler: gcc.exe"
			}
		]
	}
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
		writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR');
	}
}
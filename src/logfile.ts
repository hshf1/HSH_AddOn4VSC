import { appendFileSync, existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { window, workspace } from 'vscode';

import { getPath } from './init/paths';

let logFileName: string = '';
let logFilePath: string = '';
let logBuffer: string[] = [];

const currentDateString = new Date(Date.now()).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1');

export function initLogFile(): void {
    logFileName = `logFile-${currentDateString}.txt`;
    logFilePath = join(getPath().tempAddOn, logFileName);

    if (!existsSync(logFilePath)) {
        writeFileSync(logFilePath, `Automatisch erzeugter LogFile - HSH_AddOn4VSC\n`);
    };

    deleteLog();
}

export function getLogFileName(): string {
    return logFileName;
}

export function getLogFilePath(): string {
    return logFilePath;
}

/** Zu verwendende Level
 * 
 * - INFO
 * - WARNING
 * - ERROR
 * 
 * Beispiele:
 * 
 * `writeLog('AddOn wurde erfolgreich gestartet!', 'INFO')`
 * 
 * `writeLog('Folgende Meldung wurde ausgegeben: '+${error}, 'ERROR')`
 */
export function writeLog(msg: string, lvl: string): void {
    logBuffer.push(`[${currentDateString} ${new Date(Date.now()).toLocaleTimeString('de-DE')}][${lvl}] - ${msg}\n`);

    if (logFilePath !== '' && logBuffer.length > 0) {
        for (let i = 0; i < logBuffer.length; i++) {
            const obj = logBuffer.shift();
            try {
                if (obj) {
                    appendFileSync(logFilePath, obj);
                }
            } catch (error) {
                console.log('Fehler mit path: ' + logFilePath);
            }
        }
    }
}

function deleteLog(): void {
    const addOnDir = getPath().tempAddOn;
    const daysToKeep = 2;
    let filesToDelete: string[] = [];

    try {
        filesToDelete = readdirSync(addOnDir)
            .filter((fileName) => {
                const fileDate = new Date(fileName.replace('logFile-', '').replace('.txt', ''));
                const currentDate = new Date(currentDateString);
                const secondsPerDay = 86400000;
                return !isNaN(fileDate.getTime()) && Math.floor((currentDate.getTime() - fileDate.getTime()) / secondsPerDay) >= daysToKeep;
            })
            .map((fileName) => join(addOnDir, fileName));

        for (const fileToDelete of filesToDelete) {
            unlinkSync(fileToDelete);
            writeLog(`Alte LogFile ${fileToDelete} erfolgreich gelöscht!`, 'INFO');
        }
    } catch (error) {
        writeLog(`Fehler beim Löschen der Log-Dateien: ${error}`, 'ERROR');
    }
}

export function openLogFile(): void {
    if (existsSync(logFilePath)) {
        workspace.openTextDocument(logFilePath)
            .then((document) => {
                window.showTextDocument(document);
            });
    } else {
        window.showErrorMessage('Kein aktuelles LogFile gefunden!');
    }
}
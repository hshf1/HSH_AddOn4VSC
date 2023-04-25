
import { join } from 'path';
import { getPath } from './init';
import moment = require('moment');
import { appendFileSync, existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs';

export let logFileName: string
export let logFilePath: string
const currentDate = moment().format('YYYY-MM-DD');

export function logFileMain() {
    logFileName = `HSH_Addon4VSC_logFile-${currentDate}.txt`
    logFilePath = join(getPath('logfiledir'), logFileName)
    console.log(logFilePath)

    if(!existsSync(logFilePath)) {
        writeFileSync(logFilePath, `Automatisch erzeugter LogFile - HSH_AddOn4VSC\n`)
    }

    deleteLog()
}

export function writeLog(msg: string) {
    // Write a log message to the file
    appendFileSync(logFilePath, `${currentDate} ${moment().format('HH:mm:ss')}: ${msg}\n`);
}

function deleteLog() {
    // Delete the log file from two days ago
    const daysToKeep = 2;
    const filesToDelete = readdirSync(getPath('logfiledir'))
    .filter((fileName) => {
        const fileDate = moment(fileName.replace('HSH_Addon4VSC_logFile-', '').replace('.txt', ''));
        return fileDate.isValid() && moment().diff(fileDate, 'days') >= daysToKeep;
    })
    .map((fileName) => join(getPath('logfiledir'), fileName));

    for (const fileToDelete of filesToDelete) {
        unlinkSync(fileToDelete);
        writeLog(`LogFile ${fileToDelete} erfolgreich gelöscht!`)
    }
}
import { appendFileSync, existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

import { getPath } from './init'

let logFileName: string = ''
let logFilePath: string = ''
const currentDateString = new Date(Date.now()).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1')

export function initLogFile() {
    logFileName = `HSH_Addon4VSC_logFile-${currentDateString}.txt`
    logFilePath = join(getPath('logfiledir'), logFileName)
    
    if(!existsSync(logFilePath)) {
        writeFileSync(logFilePath, `Automatisch erzeugter LogFile - HSH_AddOn4VSC\n`)
    }

    deleteLog()
}

export function getLogFileName() {
    return logFileName
}

export function getLogFilePath() {
    return logFilePath
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
export function writeLog(msg: string, lvl: string) {
    console.log('logfilepath: '+logFilePath)
    try {
        appendFileSync(logFilePath, `[${currentDateString} ${new Date(Date.now()).toLocaleTimeString('de-DE')}][${lvl}] - ${msg}\n`)
    } catch (error) {
        console.log('Fehler mit path: '+logFilePath)
    }
    return msg
}

function deleteLog() {
    const logfiledir = getPath('logfiledir')
    const daysToKeep = 2 /** Anzahl Tage zum aufbewahren von Logs */
    let filesToDelete: string[] = []

    try {
        filesToDelete = readdirSync(logfiledir)
        .filter((fileName) => {
            const fileDate = new Date(fileName.replace('HSH_Addon4VSC_logFile-', '').replace('.txt', ''))
            const currentDate = new Date(currentDateString)
            const secondsPerDay = 86400000
            return !isNaN(fileDate.getTime()) && Math.floor((currentDate.getTime() - fileDate.getTime())/secondsPerDay) >= daysToKeep
        })
        .map((fileName) => join(logfiledir, fileName))

        for (const fileToDelete of filesToDelete) {
            unlinkSync(fileToDelete)
            writeLog(`Alte LogFile ${fileToDelete} erfolgreich gelöscht!`, 'INFO')
        }
    } catch (error) {
        writeLog(`Fehler beim Löschen der Log-Dateien: ${error}`, 'ERROR')
    }
}

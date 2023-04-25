
import { join } from 'path';
import { getPath } from './init';
import moment = require('moment');
import { appendFileSync, existsSync, readdirSync, unlinkSync, writeFileSync } from 'fs';

export let logFileName: string
export let logFilePath: string
const currentDate = moment().format('YYYY-MM-DD');

/** //FIXME:  Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
Arguments: 
[0] _isAMomentObject: true, _isUTC: false, _useUTC: false, _l: undefined, _i: .DS_Store, _f: undefined, _strict: undefined, _locale: [object Object]
Error: 
	at Function.createFromInputFallback (/Users/ck/addon4vsc/node_modules/moment/moment.js:324:25)
	at configFromString (/Users/ck/addon4vsc/node_modules/moment/moment.js:2550:19)
	at configFromInput (/Users/ck/addon4vsc/node_modules/moment/moment.js:2993:13)
	at prepareConfig (/Users/ck/addon4vsc/node_modules/moment/moment.js:2976:13)
	at createFromConfig (/Users/ck/addon4vsc/node_modules/moment/moment.js:2943:44)
	at createLocalOrUTC (/Users/ck/addon4vsc/node_modules/moment/moment.js:3037:16)
	at createLocal (/Users/ck/addon4vsc/node_modules/moment/moment.js:3041:16)
	at hooks (/Users/ck/addon4vsc/node_modules/moment/moment.js:16:29)
	at /Users/ck/addon4vsc/out/logfile.js:30:26
	at Array.filter (<anonymous>)
	at deleteLog (/Users/ck/addon4vsc/out/logfile.js:29:10)
	at logFileMain (/Users/ck/addon4vsc/out/logfile.js:16:5)
	at initMain (/Users/ck/addon4vsc/out/init.js:49:31)
	at initialize (/Users/ck/addon4vsc/out/main.js:67:25) */

export function logFileMain() {
    logFileName = `HSH_Addon4VSC_logFile-${currentDate}.txt`
    logFilePath = join(getPath('logfiledir'), logFileName)

    if(!existsSync(logFilePath)) {
        writeFileSync(logFilePath, `Automatisch erzeugter LogFile - HSH_AddOn4VSC\n`)
    }

    deleteLog()
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
    appendFileSync(logFilePath, `[${currentDate} ${moment().format('HH:mm:ss')}][${lvl}] - ${msg}\n`)
    return msg
}

function deleteLog() {
    const daysToKeep = 2 /** Anzahl Tage zum aufbewahren von Logs */
    const filesToDelete = readdirSync(getPath('logfiledir'))
    .filter((fileName) => {
        const fileDate = moment(fileName.replace('HSH_Addon4VSC_logFile-', '').replace('.txt', ''))
        return fileDate.isValid() && moment().diff(fileDate, 'days') >= daysToKeep
    })
    .map((fileName) => join(getPath('logfiledir'), fileName))

    for (const fileToDelete of filesToDelete) {
        unlinkSync(fileToDelete)
        writeLog(`LogFile ${fileToDelete} erfolgreich gelöscht!`, 'INFO')
    }
}
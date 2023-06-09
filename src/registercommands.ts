/**  Dieses Modul deklariert eine Reihe von Befehlobjekten.
Jedes Befehlsobjekt hat eine "name"-Eigenschaft, die einem bestimmten Befehl entspricht, 
sowie eine "callback"-Eigenschaft, die eine Funktion enthält die ausgeführt wird, wenn der Befehl benutzt wird.
*/

import { env, Uri, window } from 'vscode'           /** Importiert die genannten Befehle aus der VS-Code Erweiterung */

import { treeDataProvider } from './activity_bar'   /** Importiert den TreeDataProvider von activity_bar.ts */
import { getConstCommands } from './constants'         /** Importiert die Namen und Beschreibungen der Commands aus constants.ts*/
import { setsettingsjson, settasksjson } from './jsonfilescheck'       /** Importiert die Funktion zur Überprüfung und aktualisierung der .jsons Dateien aus jsonfilescheck.ts*/ 
import { 
    getStatusBarItem, initCompiler,
    getComputerraumConfig, setComputerraumConfig,
} from './init/initMain' /** Importiert Funktionen aus init.ts */
import { reportAProblem } from './reportaproblem'
import { writeLog } from './logfile'
import { getOSBoolean } from './init/os'
import { switch_directory } from './filefoldername'

const constregistercommands = [ /** Die Befehle sind in einem Array gespeichert und beziehen ihre Namen und Beschreibungen aus der Datei constants.ts */
    {
        name: getConstCommands()[0].command, /** Der Name wird aus der constants.ts geholt  */
        callback: () => {                    /** Funktion die keine Paramter erwartet und keinen Rückgabewert hat */
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[0].command}`, 'INFO')
            getStatusBarItem().text = 'AddOn4VSC pausieren' /** Übergibt dem Statusbar Button die Beschriftung */
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)' /** Übergibt dem Statusbar Button die Beschriftung beim rüberfahren mit der Maus */
            getStatusBarItem().command = 'extension.off' /** Übergibt den Command der mit dem Drücken verknüpft ist aus constants.ts */
            treeDataProvider.refresh() /** Aktualisiert den TreeView (Sidebar) */
        }
    },
    {
        name: getConstCommands()[1].command,     /** Wie vorheriger Befehl */
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[1].command}`, 'INFO')
            getStatusBarItem().text = 'AddOn4VSC wieder aktivieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            getStatusBarItem().command = 'extension.on'
            treeDataProvider.refresh()
        }
    },
    {
        name: getConstCommands()[2].command,     
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[2].command}`, 'INFO')
            setsettingsjson() /** Aktualisiert die settings.json */
            window.showInformationMessage('settings.json wurde zurückgesetzt.') /** Erzeugt kleines Fenster mit entsprechenden Inhalt */
        }
    },
    {
        name: getConstCommands()[3].command,     
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[3].command}`, 'INFO')
            settasksjson()    /** Aktualisiert die task.json */
            window.showInformationMessage('tasks.json wurde zurückgesetzt.') /** Erzeugt kleines Fenster mit entsprechenden Inhalt */
        }
    },
    {
        name: getConstCommands()[4].command,
        callback: (...args: any) => {   /** Übernimmt eine variable Anzahl von Argumenten (in diesem Fall einen Link), dessen Typ nicht spezifiziert sind */
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[4].command}`, 'INFO')
            if (args[0] === '') {       /** Überprüft ob das erste Argument 0 ist, falls dies der Fall ist wird eine Fehlermeldung ausgegeben und die Funktion beendet */
                window.showErrorMessage(writeLog(`Es wurde kein Link zum Öffnen übergeben!`, 'ERROR') )
                return
            } else {                    
                env.openExternal(Uri.parse(args[0]))    /** Ist das Argument nicht leer wird, der Link aufgerufen*/
            }
        }
    },
    {
        name: getConstCommands()[5].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[5].command}`, 'INFO')
            initCompiler()     /** Ruft Funktion auf die den Compiler initialisiert */
        }
    },
    {
        name: getConstCommands()[6].command,
        callback: async () => {     /** Erstellt asynchrone Funktion  */
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[6].command}`, 'INFO')
            const COMPUTERRAUM = getComputerraumConfig()
            if (!getOSBoolean('Windows')) { /** Überprüft ob es sich um einen Windows PC handelt */
                window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
                return
            }
            
            let userSelection = await window.showWarningMessage("Möchtest du wirklich den Standort des Windows-Rechners wechseln?", "Ja", "Nein")

            if (userSelection === "Ja") {
                if (COMPUTERRAUM) {
                    setComputerraumConfig(false)
                    window.showInformationMessage('Auf privater Windows-Rechner gestellt.')
                } else {
                    setComputerraumConfig(true)
                    window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.')
                }
    
                treeDataProvider.refresh()
            }
        }
    },
    {
        name: getConstCommands()[7].command,
        callback: async () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[7].command}`, 'INFO')
            reportAProblem() /** Führt die Fehlermelden Funktion aus */
        }
    },
    {
        name: getConstCommands()[8].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[8].command}`, 'INFO')
            window.showWarningMessage(writeLog('Programmiersprache wechseln ist derzeit nicht verfügbar!', 'WARNING'))
		    return
            // await set_language() /** Ruft Funktion auf die die Sprache neu einstellt und ändert den Offenen Ordner ggf. */
        }
    },
    {
        name: getConstCommands()[9].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[9].command}`, 'INFO')
            //window.showWarningMessage(writeLog('Verzeichnis wird gewechselt', 'INfo'))
		    switch_directory()
        }
    }
]

/** Exportiert Funktion die das Array an Befehls-Objekten für andere Module des Codes verfügbar macht */
export function getCommands() {
    return constregistercommands
}
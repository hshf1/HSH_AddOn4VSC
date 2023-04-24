/**  Dieses Modul deklariert eine Reihe von Befehlobjekten.
Jedes Befehlsobjekt hat eine "name"-Eigenschaft, die einem bestimmten Befehl entspricht, 
sowie eine "callback"-Eigenschaft, die eine Funktion enthält die ausgeführt wird, wenn der Befehl benutzt wird.
*/

import { env, Uri, window } from 'vscode'           /** Importiert die genannten Befehle aus der VS-Code Erweiterung */

import { treeDataProvider } from './activity_bar'   /** Importiert den TreeDataProvider von activity_bar.ts */
import { constcommands } from './constants'         /** Importiert die Namen und Beschreibungen der Commands aus constants.ts*/
import { renewjsons } from './jsonfilescheck'       /** Importiert die Funktion zur Überprüfung und aktualisierung der .jsons Dateien aus jsonfilescheck.ts*/ 
import { compiler_init, getPath, setRZHsH, getStatusBarItem } from './init' /** Importiert Funktionen aus init.ts */
import { reportAProblem } from './reportaproblem'
import { set_language } from './language_handler'


const constregistercommands = [             /** Die Befehle sind in einem Array gespeichert und beziehen ihre Namen und Beschreibungen aus der Datei constants.ts */
    {
        name: constcommands[0].command,     /** Der Name wird aus der constants.ts geholt  */
        callback: () => {                   /** Funktion die keine Paramter erwartet und keinen Rückgabewert hat */
            getStatusBarItem().text = 'AddOn4VSC pausieren' /** Übergibt dem Statusbar Button die Beschriftung */
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)' /** Übergibt dem Statusbar Button die Beschriftung beim rüberfahren mit der Maus */
            getStatusBarItem().command = 'extension.off' /** Übergibt den Command der mit dem Drücken verknüpft ist aus constants.ts */
            treeDataProvider.refresh()      /** Aktualisiert den TreeView (Sidebar) */
        }
    },
    {
        name: constcommands[1].command,     /** Wie vorheriger Befehl */
        callback: () => {
            getStatusBarItem().text = 'AddOn4VSC wieder aktivieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            getStatusBarItem().command = 'extension.on'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[2].command,     
        callback: () => {
            renewjsons(getPath('settingsjson')) /** Aktualisiert die settings.json */
            window.showInformationMessage('settings.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.') /** Erzeugt kleines Fenster mit entsprechenden Inhalt */

        }
    },
    {
        name: constcommands[3].command,     
        callback: () => {
            renewjsons(getPath('tasksjson'))    /** Aktualisiert die task.json */
            window.showInformationMessage('tasks.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.') /** Erzeugt kleines Fenster mit entsprechenden Inhalt */
        }
    },
    {
        name: constcommands[4].command,
        callback: (...args: any) => {   /** Übernimmt eine variable Anzahl von Argumenten (in diesem Fall einen Link), dessen Typ nicht spezifiziert sind */
            if (args[0] === '') {       /** Überprüft ob das erste Argument 0 ist, falls dies der Fall ist wird eine Fehlermeldung ausgegeben und die Funktion beendet */
                window.showErrorMessage('Es wurde kein Link zum Öffnen übergeben!')
                return
            } else {                    
                env.openExternal(Uri.parse(args[0]))    /** Ist das Argument nicht leer wird, der Link aufgerufen*/
            }
        }
    },
    {
        name: constcommands[5].command,
        callback: () => {
            compiler_init()     /** Ruft Funktion auf die den Compiler initialisiert */
        }
    },
    {
        name: constcommands[6].command,
        callback: async () => {     /** Erstellt asynchrone Funktion  */
            await setRZHsH()         /** Ruft Funktion auf die die Einstellungen für den HSH Rechner einstellt */
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[7].command,
        callback: async () => {
            await reportAProblem()
        }
    },
    {
        name: constcommands[8].command,
        callback: async () => {
            await set_language("C") /** Ruft Funktion auf die die Sprache neu einstellt und ändert den Offenen Ordner ggf. */
        }
    },
    {
        name: constcommands[9].command,
        callback: async () => {
            await set_language("Java") /** Ruft Funktion auf die die Sprache neu einstellt und ändert den Offenen Ordner ggf. */
        }
    },

]

export function getCommands() {            /**  Exportiert Funktion die das Array an Befehls-Objekten für andere Module des Codes verfügbar macht  */
    return constregistercommands
}
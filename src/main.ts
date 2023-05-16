/** Main Datei der Erweiterung.
 * Der Code importiert verschiedene Module aus der VS Code API und mehrere Funktionen aus anderen Dateien im gleichen Verzeichnis.
 * Die activate()-Funktion initialisiert die Erweiterung und überprüft, ob die erforderlichen Konfigurationsdateien vorhanden sind.
 * Sie öffnet auch einen voreingestellten Ordner, wenn kein Arbeitsbereich geöffnet ist.
 * Darüber hinaus registriert sie mehrere "Event Handler", um Konfigurationsänderungen, Dateispeicherungen und Debugger-Breakpoints zu behandeln. 
 * Die activate()-Funktion registriert auch mehrere Befehle für die Benutzeroberfläche.
*/

// TODO: VSCode Version in HsH prüfen, dann package.json min. Version auf 1.75 setzen

import {									
	ExtensionContext, commands, workspace,	
	debug, ConfigurationChangeEvent	
} from 'vscode'		

/** Importiert die genannten Befehle aus der VS-Code Erweiterung 
 * ExtensionContext: Eine Klasse, die Kontextinformationen zur Erweiterung enthält und verschiedene Erweiterungs-APIs bereitstellt.
 * commands: Ein Objekt, das verschiedene Methoden bereitstellt, um Befehle in der Visual Studio Code-UI zu registrieren und auszuführen.
 *  workspace: Ein Objekt, das verschiedene Methoden und Eigenschaften bereitstellt, um auf Workspace-Informationen und -Einstellungen zuzugreifen.
 *  debug: Ein Objekt, das Methoden und Ereignisse bereitstellt, um Debugging-Funktionen in Visual Studio Code-Erweiterungen zu aktivieren.
 *	ConfigurationChangeEvent: Ein Ereignis, das ausgelöst wird wenn sich eine Konfigurationseinstellung ändert. Enthält Informationen über die änderung */

import { initialize } from './init/initMain' /** Importiert eine Reihe von Befehlen aus der init.ts */
import { getCommands } from './registercommands' /** Importiert die Registerbefehle für die Anzeigen aus registercommands.ts */
import { writeLog } from './logfile'
import { eventHandler_changeProgLanguage, eventHandler_checkName } from './eventHandler'

/** die "activate" Funktion wird von VS-Code aufgerufen, wenn die Erweiterung aktiviert wird */
export function activate(context: ExtensionContext) {
	initialize()/** Ruft die Funktion auf, die die Initialisierung beginnt */

	workspace.onDidSaveTextDocument(eventHandler_checkName)						/** Wenn der Benutzer eine Datei im Workspace speichert wird die Funktion aufgerufen, die den Namen auf Umlaute überprüft */
	debug.onDidChangeBreakpoints(eventHandler_checkName)						/** Wenn der Benutzer die Debugger Breakpoints verändert wird die Funktion aufgerufen, die den Namen auf Umlaute überprüft */
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {	
		if (event.affectsConfiguration('addon4vsc.sprache')) {
			eventHandler_changeProgLanguage()
		}
	})
	  
	getCommands().forEach(command => { /** For Schleife durch alle "command" Objekte in "registercommands.ts". name: name des commands, callback: Funktion die ausgeführt wird */
		/** Durch "context.subscriptions.push" wird das Objekt nach deaktivieren der Erweiterung ordnungsgemäss aufgeräumt */
		context.subscriptions.push(commands.registerCommand(command.name, command.callback))
	})
}

/** Funktion die Aufgerufen wird wenn die Erweiterung deaktiviert oder deinstalliert wird.*/
export function deactivate() {
	writeLog('HSH_AddOn4VSC wird ordnungsgemäß beendet!', 'INFO')
}
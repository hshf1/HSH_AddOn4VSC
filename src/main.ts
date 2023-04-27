/** Main Datei der Erweiterung.
 * Der Code importiert verschiedene Module aus der VS Code API und mehrere Funktionen aus anderen Dateien im gleichen Verzeichnis.
 * Die activate()-Funktion initialisiert die Erweiterung und überprüft, ob die erforderlichen Konfigurationsdateien vorhanden sind.
 * Sie öffnet auch einen voreingestellten Ordner, wenn kein Arbeitsbereich geöffnet ist.
 * Darüber hinaus registriert sie mehrere "Event Handler", um Konfigurationsänderungen, Dateispeicherungen und Debugger-Breakpoints zu behandeln. 
 * Die activate()-Funktion registriert auch mehrere Befehle für die Benutzeroberfläche.
*/

import {									
	ExtensionContext, commands, workspace,	
	debug, ConfigurationChangeEvent	
} from 'vscode'		

/** Importiert die genannten Befehle aus der VS-Code Erweiterung 
 * ExtensionContext: Eine Klasse, die Kontextinformationen zur Erweiterung enthält und verschiedene Erweiterungs-APIs bereitstellt.
 * commands: Ein Objekt, das verschiedene Methoden bereitstellt, um Befehle in der Visual Studio Code-UI zu registrieren und auszuführen.
 *  workspace: Ein Objekt, das verschiedene Methoden und Eigenschaften bereitstellt, um auf Workspace-Informationen und -Einstellungen zuzugreifen.
 *  debug: Ein Objekt, das Methoden und Ereignisse bereitstellt, um Debugging-Funktionen in Visual Studio Code-Erweiterungen zu aktivieren.
 *	window: Ein Objekt, das verschiedene Methoden und Eigenschaften bereitstellt, um auf die Visual Studio Code-UI zuzugreifen und sie zu manipulieren. 
 *	ConfigurationChangeEvent: Ein Ereignis, das ausgelöst wird wenn sich eine Konfigurationseinstellung ändert. Enthält Informationen über die änderung */

import {
	getHsHRZ, getOS, getStatusBarItem,
	initMain, changeHsHOrPrivate
} from './init'										/** Importiert eine Reihe von Befehlen aus der init.ts */
import { checkname } from './filefoldername'		/** Importiert die Funktion zum überprüfen des Dateinames aus filefoldername.ts */
import { getCommands } from './registercommands'	/** Importiert die Registerbefehle für die Anzeigen aus registercommands.ts */
import { treeDataProvider } from './activity_bar'	/** Importiert Funktionen der Activity Bar */
import { writeLog } from './logfile'

/** die "activate" Funktion wird von VS-Code aufgerufen, wenn die Erweiterung aktiviert wird */
export function activate(context: ExtensionContext) {
	initMain()	/** Ruft die Funktion auf, die die Initialisierung beginnt */

	const eventHandler_checkname = async () => {    /**	Code definiert eine asynchrone Funktion die als Event Handler fungiert */
		if (getStatusBarItem().command === 'extension.off') {	/** überprüft ob der Statusleisten Button auf "pausiert" steht */
			await checkname()                         			/**	Führt die Funktion aus die den Namen überprüft und wartet bis sie fertig ist */
		}
	}
	workspace.onDidSaveTextDocument(eventHandler_checkname)						/** Wenn der Benutzer eine Datei im Workspace speichert wird die Funktion aufgerufen, die den Namen auf Umlaute überprüft */
	debug.onDidChangeBreakpoints(eventHandler_checkname)						/** Wenn der Benutzer die Debugger Breakpoints verändert wird die Funktion aufgerufen, die den Namen auf Umlaute überprüft */
  	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {	/** Funktion wird ausgelöst wenn sich Konfigurationseinstellungen geändert haben */
		if (event.affectsConfiguration('addon4vsc.computerraum')) {       		/** Überprüft, ob geänderte Einstellung das AddOn betrifft */	
			if (getOS('WIN')) {                       							/** überprüft ob Windows */
				let temp_hshRZ: boolean | undefined = undefined         		/** Deklareriert temporäre Variable die aussagt ob es erfolgreich war die Konfiguartion zu bekommen */
				while(temp_hshRZ === undefined) {               				/** In jeder Iteration wird der Wert von temp_hshRZ mit dem aktuellen Wert der Konfiguration addon4vsc.computerraum aktualisiert, bis ein Wert gefunden wurde. */
					temp_hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
				}
				if (temp_hshRZ != getHsHRZ()) {		/** überprüft ob sich der Wert geändert hat der Aussagt ob man im Computerraum ist */
					changeHsHOrPrivate(temp_hshRZ)	/** Führt die Funktion aus, um die Pfade anzupassen */
					treeDataProvider.refresh()		/** Aktualisiert die Anzeige der Activity Bar */
					writeLog(`Einstellung auf ${temp_hshRZ ? 'HsH-Rechner' : 'privaten Rechner'} geändert!`, 'INFO')
				}						
			}
		}
	})

	getCommands().forEach(command => {															/** For Schleife durch alle "command" Objekte in "registercommands.ts". name: name des commands, callback: Funktion die ausgeführt wird */
		context.subscriptions.push(commands.registerCommand(command.name, command.callback))	/** Durch "context.subscriptions.push" wird das Objekt nach deaktivieren der Erweiterung ordnungsgemäss aufgeräumt */
	})
}

/** Funktion die Aufgerufen wird wenn die Erweiterung deaktiviert oder deinstalliert wird.*/
export function deactivate() {
	writeLog('HSH_AddOn4VSC wurde ordnungsgemäß beendet!', 'INFO')
}
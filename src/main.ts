/** Main Datei der Erweiterung.
 * Der Code importiert verschiedene Module aus der VS Code API und mehrere Funktionen aus anderen Dateien im gleichen Verzeichnis.
 * Die activate()-Funktion initialisiert die Erweiterung und berprft, ob die erforderlichen Konfigurationsdateien vorhanden sind.
 * Sie ”ffnet auch einen voreingestellten Ordner, wenn kein Arbeitsbereich ge”ffnet ist.
 * Darber hinaus registriert sie mehrere "Event Handler", um Konfigurations„nderungen, Dateispeicherungen und Debugger-Breakpoints zu behandeln. 
 * Die activate()-Funktion registriert auch mehrere Befehle fr die Benutzeroberfl„che.
*/

import { ExtensionContext, commands, workspace, debug, window, ConfigurationChangeEvent } from 'vscode'	/** Importiert die genannten Befehle aus der VS-Code Erweiterung
																										ExtensionContext: Eine Klasse, die Kontextinformationen zur Erweiterung enth„lt und verschiedene Erweiterungs-APIs bereitstellt. 
			 																									commands: Ein Objekt, das verschiedene Methoden bereitstellt, um Befehle in der Visual Studio Code-UI zu registrieren und auszufhren.
																											   workspace: Ein Objekt, das verschiedene Methoden und Eigenschaften bereitstellt, um auf Workspace-Informationen und -Einstellungen zuzugreifen.
																												   debug: Ein Objekt, das Methoden und Ereignisse bereitstellt, um Debugging-Funktionen in Visual Studio Code-Erweiterungen zu aktivieren.
			   																									  window: Ein Objekt, das verschiedene Methoden und Eigenschaften bereitstellt, um auf die Visual Studio Code-UI zuzugreifen und sie zu manipulieren. 
																								ConfigurationChangeEvent: Ein Ereignis, das ausgel”st wird wenn sich eine Konfigurationseinstellung „ndert. Enth„lt Informationen ber die Žnderung */


import { openprefolder } from './checkfolder'								/** Importiert die Funktion zum ™ffnen des Vorgefertigten Ordner aus  checkfolder.ts */
import { checkname } from './filefoldername'								/** Importiert die Funktion zum šberprfen des Dateinames aus filefoldername.ts */
import { checkjsons, renewjsons } from './jsonfilescheck'					/** Importiert die Funktion zum šberprfen der jsons-Datei aus jsonfilescheck.ts */
import { constregistercommands } from './registercommands'					/** Importiert die Registerbefehle fr die Anzeigen aus registercommands.ts */
import { filePath_tasksjson, hshRZ, IS_WINDOWS, sethshRZ, setPath, setting_init, statusbar_button } from './init' /** Importiert eine Reihe von Befehlen aus der init.ts */
import { github_status } from './github'									/** Importiert den Status, ob Anfrage, nach .txt Datei mit ntzlichen Links, an den GitHub Server erfolgreich war aus github.ts*/
import { constcommands } from './constants'									/** Importiert die Namen und Beschreibungen der Commands aus constants.ts*/

export async function activate(context: ExtensionContext) {					/** die "activate" Funktion wird von VS-Code aufgerufen, wenn die Erweierung aktiviert wird */

	initialize()															/** Ruft die Funktion auf die, die Initialisierung beginnt */

	checkjsons()															/** Ruft die Funktion auf die, sicherstellt, dass die Konfigurationsdateien vorhanden sind */

	if (!(workspace.workspaceFolders?.toString)) {							/** Funktion die schaut, ob Ordner in VS-Code ge”ffnet ist und ggf. den Vorgefertigten Ordner ”ffnet */
		openprefolder()
	}

	const eventHandler_checkname = async () => {							/**	Code definiert eine asynchrone Funktion die als Event Handler fungiert */
		if (statusbar_button.command === 'extension.off') {					/** šberprft ob der Statusleisten Button auf "pausiert" steht */
			await checkname()												/**	Fhrt die Funktion aus die den Namen berprft und wartet bis sie fertig ist */
		}
	}

	workspace.onDidSaveTextDocument(eventHandler_checkname)					/** Wenn der Benutzer eine Datei im Workspace speichert wird die Funktion aufgerufen, die den Namen auf Umlaute berprft */
	debug.onDidChangeBreakpoints(eventHandler_checkname)					/** Wenn der Benutzer die Debugger Breakpoints ver„ndert wird die Funktion aufgerufen, die den Namen auf Umlaute berprft */

	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {   /** Funktion wird ausgel”st wenn sich Konfigurationseinstellungen ge„ndert haben */
		if (event.affectsConfiguration('addon4vsc.computerraum')) {				/** Fragt ob System ein PC aus Computerraum der HSH ist */	
			if (IS_WINDOWS) {													/** šberprft ob Windows */
				let temp_hshRZ: boolean | undefined = undefined					/** Deklareriert tempor„re Variable die aussagt ob es erfolgreich war die Konfiguartion zu bekommen */
				while(temp_hshRZ === undefined) {								/** In jeder Iteration wird der Wert von temp_hshRZ mit dem aktuellen Wert der Konfiguration addon4vsc.computerraum aktualisiert, bis ein Wert gefunden wurde. */
					temp_hshRZ = workspace.getConfiguration('addon4vsc').get('computerraum')
				}
				if (temp_hshRZ != hshRZ) {									/** šberprft ob sich der Wert ge„ndert hat der Aussagt ob man im Computerraum ist */
					sethshRZ(temp_hshRZ)									/** Setzt den neuen Wert ein */
					setPath()												/** Setzt die Pfade neu */
					commands.executeCommand(constcommands[3].command)		/** Fhrt command 3 aus, "tasks.json" zurcksetzen" */
				}
			}
		}
	})

	constregistercommands.forEach(command => {															/** For Schleife durch alle "command" Objekte in "registercommands.ts". name: name des commands, callback: Funktion die ausgefhrt wird */
		context.subscriptions.push(commands.registerCommand(command.name, command.callback))			/** Durch "context.subscriptions.push" wird das Objekt nach deaktivieren der Erweiterung ordnungsgem„á aufger„umt */
	})

}

async function initialize() {								/** Der Zweck dieser Funktion ist es, die Module init.ts und github.ts zu initialisieren */
	let init_status: boolean | undefined = undefined		/** Deklaration von init_status, Variable gibt an ob die Initialisierung erfolgreich war */
	try {
		await require('./init')								/** Versucht Modul init.ts zu laden */
		await require('./github')							/** Versucht Modul github.ts zu laden */
	} catch (error) {													/** Wenn ein Fehler w„hrend des Ladevorgangs auftritt, wird der catch-Block ausgefhrt. */
		console.error(error);											/** Fehler wird in der Konsole ausgegeben */
		await new Promise(resolve => setTimeout(resolve, 1000))			/** Funktion wartet eine Sekunde mit setTimeout(), bevor sie sich selbst rekursiv aufruft, um es erneut zu versuchen.*/
		await initialize()												
	}
	while (init_status === undefined) {											/** Schleife wird solange ausgefhrt bis init_status nicht mehr undefiniert ist */
		if (setting_init !== undefined && github_status !== undefined) {		/** šberprft ob init.ts aufgerufen wurde und github.ts aufgerufen wurde*/
			if (setting_init === false) {										/** Falls bei init.ts Fehler aufgetreten sind kommt dieses Meldung.  */
				window.showWarningMessage('Einstellungen konnten nicht richtig initialisiert werden. Bei Problem VSCode neu starten.')
			}
			if (github_status === false) {										/** Falls bei github.ts Fehler aufgetreten sind kommt dieses Meldung.  */
				window.showWarningMessage(`NÃ¼tzliche Links aus GitHub konnten nicht geladen werden. Bei Bedarf Internetverbindung prÃ¼fen und VSCode neu starten.`)
			}
			init_status = true													/** Wenn beide Module erfolgreich geladen worden, wird der init_status gestzt und somit die Initalisierung abgeschlossen */
		}
		await new Promise(resolve => setTimeout(resolve, 1000));				/** Wartet 1000ms bevor die Schleife wieder anf„ngt */
	}
}

export function deactivate() { }		/** Funktion die Aufgerufen wird wenn die Erweiterung deaktiviert oder deinstalliert wird.*/
/** Dieses Modul stellt ein Menü in der Aktivitätsleiste bereit, das dem Benutzer nützliche Links und Optionen bietet, um die Erweiterung zu konfigurieren.
 *  Der Code definiert eine Klasse, die als Datenquelle für das Menü dient, und erstellt dann eine Instanz dieser Klasse und registriert sie als Datenquelle 
 *  für das Menü. Der Code verfügt auch über eine Funktion, die die Daten des Addons aktualisiert.
 */

import {
    window, Command, TreeDataProvider, TreeViewOptions,
    TreeItemCollapsibleState, EventEmitter, Event, TreeItem
} from 'vscode' 
/** Importiert die genannten Befehle aus der VS-Code Erweiterung 
*   window: Das window-Objekt stellt Methoden zur Interaktion mit dem Editorfenster bereit.
*   Command: Die Command-Klasse repräsentiert eine ausführbare Aktion, die durch eine Schaltfläche oder ein Menüelement in der Benutzeroberfläche ausgelöst werden kann.
*   TreeDataProvider: Die TreeDataProvider-Klasse definiert die Schnittstelle, mit der eine Hierarchie von Elementen in einem TreeView bereitgestellt wird.
*   TreeViewOptions: Die TreeViewOptions-Klasse definiert die Optionen für eine TreeView-Instanz.
*   TreeItemCollapsibleState: Der TreeItemCollapsibleState-Typ definiert die möglichen Zustände eines TreeView-Elements (zusammengeklappt, ausgeklappt oder kein Unterobjekt).
*   EventEmitter: Die EventEmitter-Klasse stellt ein Ereignis bereit, das von anderen Objekten abonniert werden kann.
*   Event: Die Event-Klasse ist eine Typdefinition für ein Ereignis, das von anderen Objekten abonniert werden kann.
*   TreeItem: Die TreeItem-Klasse stellt ein Element in einem TreeView dar.
*/

import { getConstCommands } from './constants' /** Importiert die Befehle aus der constants.ts  */
import { getGithubLinks } from './github' /** Importiert die Links und den GitHubStatus aus github.ts */
import { getComputerraumConfig, getStatusBarItem } from './init' /** Importiert Funktionen aus init.ts */
import { writeLog } from './logfile'

export let treeDataProvider: DepNodeProvider /** Deklariert Globale Variable treeDataProvider, die für die Baumstruktur der Seitenleiste wichtig ist  */
let treeViewOptions: TreeViewOptions<Dependency> 
let dependencies_link: Dependency[] = [], dependencies_main: Dependency[] = [], dependencies_settings: Dependency[] = [], dependencies_program_languages: Dependency[] = []
/** Definiert leere Dependency Arrays, die später die Elemente enthalten die in der Seitenleiste angezeigt werden */

/** Dependency Erweitert die TreeItem Klasse */
class Dependency extends TreeItem { 
    constructor(
        public readonly label: string, /** Definiert die Beschriftung als String */
        public readonly collapsibleState: TreeItemCollapsibleState, /** Definiert die Einstellung ob einklappbar oder nicht */
        public readonly command?: Command, /** Definiert das ein Befehl ausgeführt werden kann */
    ) {
        super(label, collapsibleState); /** Übergibt die Parameter label und collapsibaleState an Elterklasse(TreeItem), dadurch können Dependecies als TreeItem dargestellt werden*/
    }
} 

/** Diese Klasse implementiert die TreeDataProvider-Schnittstelle und definiert Methoden, um Daten anzuzeigen, wenn der Benutzer auf den Baum klickt oder ihn erweitert. */
class DepNodeProvider implements TreeDataProvider<Dependency> {

    /** _onDidChangeTreeData ist ein Event-Emitter, der verwendet wird um andere Teile des Codes zu benachrichtigen, dass sich die Baumdaten geändert haben. */
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()
    /** onDidChangeTreeData ist eine öffentliche Instanz der Event-Klasse, die das _onDidChangeTreeData Ereignis auslöst, um registrierten Listenern 
     * (z. B. der createTreeView-Funktion) mitzuteilen, dass sich die Baumdaten geändert haben. */
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

    
    refresh(): void {  /** löst das Event aus, um den Baum zu aktualisieren. */
        aktualisieren() /** Ruft Funktion auf die die Seitenleiste aktualisiert */
        this._onDidChangeTreeData.fire(undefined) /** Löst Event aus, sorgt dafür, dass alle TreeItems neu gerendert werden müssen */
        writeLog(`Activity Bar aktualisiert!`, 'INFO')
    }

    /** Funktion die eine Dependency als Eingabe erwartet und es als TreeItem ausgibt */
    getTreeItem(element: Dependency): TreeItem {
        return element
    }

    /** Funktion die eine Dependency als Eingabe erwartet und Dependency Array zurückgibt, die bearbeitung erfolgt asynchron um den Haupt-Thread nicht zu blockieren */
    getChildren(element?: Dependency): Thenable<Dependency[]> {
        if (!element) {
            return Promise.resolve(this.getDependencies()) /** Ruft Funktion auf die nur die main Dependencies zurückgibt */
        } else {
            return Promise.resolve(this.getPackageDependencies(element)) /** Ruft Funktion auf die die unter Dependencies zurückgibt */
        }
    }

    /** Funktion die das Array der main Depenencies zurückgibt*/
    private getDependencies(): Dependency[] {
        return [
            ...dependencies_main
        ]
    }

    /** Funktion die als Eingabe eine Dependency erwartet und ein Array von Dependencys zurückgibt */
    private getPackageDependencies(dependency: Dependency): Dependency[] {
        if (dependency.label === 'Einstellungen') { /** Wenn Label Einstellungen  */
            return [
                ...dependencies_settings /** Gibt die settings Dependencies zurück */
            ]
        } else if (dependency.label === 'Nützliche Links') { /** Wenn Label Nützliche Links  */
            return [
                ...dependencies_link    /** Gibt die links Dependencies zurück */
            ]
        } else if (dependency.label === 'Programmiersprache ändern (Nur HSH Rechner!)') { /** Programmiersprache ändern  */
            return [
            ...dependencies_program_languages   /** Gibt die program_languages Dependencies zurück */
        ]    
        } else {
            return [] /** Falls keins der beiden Labels zutrifft übergebe nichts */
        }
    }
}

/** Globale Funktion die für die Seitenleiste zuständig ist*/
export async function initActivityBar() {
    aktualisieren() /** Ruft Funktion auf die die Seitenleiste aktualisiert */

    treeDataProvider = new DepNodeProvider();/** Erstellt neue Instanz der DepNodeProvider die eine Implementierung des TreeDataProvider-Interafaces ist und somit eine Baumstruktur von Objekten*/
    treeViewOptions = {
        treeDataProvider: treeDataProvider /** Objekt wird so definiert das eine TreeDataProivder Eigenschaft hat, die auf die Variable gleichen Names verweist */
    }

    const links = await getGithubLinks() /** github Links werden in die Variable links geladen */
    for (let i = 0; i < links.length; i++) { /** Schleife durch alle Links */
        dependencies_link.push(new Dependency(links[i].name, TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: [links[i].link] }))
    }   /** Definiert die Links als neue Dependencys/Elemente die in der Seitenleiste unter Links auftauchen */

    window.registerTreeDataProvider('menue_bar_activity', treeDataProvider) /** Erstellt neuen TreeView mit dem Namen "menue_bar_activity" und den Daten aus TreeDataProvider*/
    window.createTreeView('menue_bar_activity', treeViewOptions) /** Erstellt die grphische Oberfläche des TreeViews an der Seitenleiste */
    writeLog(`Activity Bar geladen!`, 'INFO')
}

/** Funktion die die Seitenleiste aktualisiert */
async function aktualisieren() {
    dependencies_main = [ /** Definiert die Dependencies des Main Arrays neu */
        new Dependency('GitHub: Vorlesung C', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VorlesungC', ''] }),
        new Dependency((getStatusBarItem().command === 'extension.off') ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren', TreeItemCollapsibleState.None, getConstCommands()[(getStatusBarItem().command === 'extension.off') ? 1 : 0]),
        new Dependency('Programmiersprache ändern', TreeItemCollapsibleState.None, getConstCommands()[8]),
        new Dependency('Einstellungen', TreeItemCollapsibleState.Collapsed),
        new Dependency('Nützliche Links', TreeItemCollapsibleState.Expanded),
        new Dependency('Problem melden', TreeItemCollapsibleState.None, getConstCommands()[7])
    ]

    dependencies_settings = [ /** Definiert die Dependencies des settings Arrays neu */
        new Dependency('settings.json zurücksetzen', TreeItemCollapsibleState.None, getConstCommands()[2]),
        new Dependency('tasks.json zurücksetzen', TreeItemCollapsibleState.None, getConstCommands()[3]),
        new Dependency('Compiler prüfen', TreeItemCollapsibleState.None, getConstCommands()[5]),
        new Dependency(getComputerraumConfig() ? 'Ändern auf privaten Windows-Rechner' : 'Ändern auf HsH Windows-Rechner', TreeItemCollapsibleState.None, getConstCommands()[6])
    ]
}
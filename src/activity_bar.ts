import { window, Command, TreeDataProvider, TreeViewOptions, TreeItemCollapsibleState, EventEmitter, Event, TreeItem } from 'vscode';

import { getConstCommands } from './constants';
import { getComputerraumConfig, getStatusBarItem } from './init/init';
import { writeLog } from './logfile';

let treeViewOptions: TreeViewOptions<Dependency>;
let dependencies_main: Dependency[] = [];
let dependencies_settings: Dependency[] = [];
let dependencies_settingsjson: Dependency[] = [];
let dependencies_program_languages: Dependency[] = [];

export let treeDataProvider: DepNodeProvider;

class Dependency extends TreeItem {
    constructor(
        public readonly label: string, public readonly collapsibleState: TreeItemCollapsibleState, public readonly command?: Command
    ) {
        super(label, collapsibleState);
    }
}

class DepNodeProvider implements TreeDataProvider<Dependency> {

    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;


    refresh(): void {
        aktualisieren();
        this._onDidChangeTreeData.fire(undefined);
        writeLog(`Activity Bar aktualisiert!`, 'INFO');
    }

    getTreeItem(element: Dependency): TreeItem {
        return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[]> {
        if (!element) {
            return Promise.resolve(this.getDependencies());
        } else {
            return Promise.resolve(this.getPackageDependencies(element));
        }
    }

    private getDependencies(): Dependency[] {
        return [
            ...dependencies_main
        ]
    }

    private getPackageDependencies(dependency: Dependency): Dependency[] {
        if (dependency.label === 'Einstellungen') {
            return [...dependencies_settings];
        } else if (dependency.label === 'settings.json') {
            return [...dependencies_settingsjson];
        } else if (dependency.label === 'Programmiersprache ändern (bald verfügbar!)') {
            return [...dependencies_program_languages];
        } else {
            return [];
        }
    }
}

export async function initActivityBar(): Promise<void> {
    aktualisieren();

    treeDataProvider = new DepNodeProvider();
    treeViewOptions = {
        treeDataProvider: treeDataProvider
    }

    window.registerTreeDataProvider('menue_bar_activity', treeDataProvider);
    window.createTreeView('menue_bar_activity', treeViewOptions);
    writeLog(`Activity Bar geladen!`, 'INFO');
}

async function aktualisieren(): Promise<void> {
    dependencies_main = [
        new Dependency('GitHub: Vorlesung C', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VorlesungC', ''] }),
        new Dependency((getStatusBarItem().command === 'extension.off') ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren', TreeItemCollapsibleState.None, getConstCommands()[(getStatusBarItem().command === 'extension.off') ? 1 : 0]),
        new Dependency('Programmiersprache ändern', TreeItemCollapsibleState.None, getConstCommands()[8]),
        new Dependency('Verzeichnis wechseln', TreeItemCollapsibleState.None, getConstCommands()[9]),
        new Dependency('Einstellungen', TreeItemCollapsibleState.Collapsed),
        new Dependency('Problem melden', TreeItemCollapsibleState.None, getConstCommands()[7]),
    ];

    dependencies_settings = [ /** Definiert die Dependencies des settings Arrays neu */
        new Dependency('settings.json', TreeItemCollapsibleState.Collapsed),
        new Dependency('tasks.json zurücksetzen', TreeItemCollapsibleState.None, getConstCommands()[3]),
        new Dependency('Compiler prüfen', TreeItemCollapsibleState.None, getConstCommands()[5]),
        new Dependency(getComputerraumConfig() ? 'Ändern auf privaten Windows-Rechner' : 'Ändern auf HsH Windows-Rechner', TreeItemCollapsibleState.None, getConstCommands()[6])
    ];

    dependencies_settingsjson = [
        new Dependency('settings.json überprüfen', TreeItemCollapsibleState.None, getConstCommands()[12]),
        new Dependency('settings.json zurücksetzen', TreeItemCollapsibleState.None, getConstCommands()[2]),
        new Dependency('aktuelle settings.json öffnen', TreeItemCollapsibleState.None, getConstCommands()[10]),
        new Dependency('alte settings.json öffnen', TreeItemCollapsibleState.None, getConstCommands()[11])
    ];
}
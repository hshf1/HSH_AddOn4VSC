import { 
    window, Command, TreeDataProvider, TreeViewOptions, TreeItemCollapsibleState,
    EventEmitter, Event, TreeItem
} from 'vscode';

import { getCommands } from '../constants/Commands';
import { OS, getComputerraumConfig, getOSBoolean } from './OS';
import { infoNotification } from './Notifications';

let dependenciesMain: Dependency[] = [];
let dependenciesSettings: Dependency[] = [];
let dependenciesSettingsjson: Dependency[] = [];
let dependenciesTasksjson: Dependency[] = [];
let dependenciesCompiler: Dependency[] = [];
let dependenciesChocolatey: Dependency[] = [];
let dependenciesCCompiler: Dependency[] = [];
let dependenciesJavaCompiler: Dependency[] = [];
let dependenciesPythonCompiler: Dependency[] = [];

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
        infoNotification(`Activity Bar aktualisiert!`);
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
            ...dependenciesMain
        ];
    }

    private getPackageDependencies(dependency: Dependency): Dependency[] {
        if (dependency.label === 'Einstellungen') {
            return [...dependenciesSettings];
        } else if (dependency.label === 'settings.json') {
            return [...dependenciesSettingsjson];
        } else if (dependency.label === 'tasks.json') {
            return [...dependenciesTasksjson];
        } else if (dependency.label === 'Compiler') {
            return [...dependenciesCompiler];
        } else if (dependency.label === 'Chocolatey (Zur installation von Compilern)') {
            return [...dependenciesChocolatey];
        } else if (dependency.label === 'C-Compiler') {
            return [...dependenciesCCompiler];
        } else if (dependency.label === 'Java-Compiler') {
            return [...dependenciesJavaCompiler];
        } else if (dependency.label === 'Python-Compiler') {
            return [...dependenciesPythonCompiler];
        } else {
            return [];
        }
    }
}

export async function initActivityBar(): Promise<void> {
    aktualisieren();

    treeDataProvider = new DepNodeProvider();
    const treeViewOptions: TreeViewOptions<Dependency>  = {
        treeDataProvider: treeDataProvider
    };

    window.registerTreeDataProvider('menue_bar_activity', treeDataProvider);
    window.createTreeView('menue_bar_activity', treeViewOptions);
    infoNotification(`Activity Bar geladen!`);
}

async function aktualisieren(): Promise<void> {
    dependenciesMain = [
        new Dependency('GitHub: VSCode (HsH-Repository)', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VSCode'] }),
        new Dependency('GitHub: Vorlesung C (HsH-Repository)', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VorlesungC'] }),
        new Dependency('In Verzeichnis der geöffneten Datei wechseln', TreeItemCollapsibleState.None, getCommands()[9]),
        ...(!getComputerraumConfig()
            ? [new Dependency('Compiler', TreeItemCollapsibleState.Collapsed)]
            : []),
        new Dependency('Einstellungen', TreeItemCollapsibleState.Collapsed),
        new Dependency('Problem melden', TreeItemCollapsibleState.None, getCommands()[7])
    ];

    dependenciesSettings = [
        new Dependency('settings.json', TreeItemCollapsibleState.Collapsed),
        new Dependency('tasks.json', TreeItemCollapsibleState.Collapsed),
        new Dependency('LogFile öffnen', TreeItemCollapsibleState.None, getCommands()[16]),
        ...(getOSBoolean(OS.windows)
            ? [new Dependency(getComputerraumConfig() ? 'Ändern auf privaten Windows-Rechner' : 'Ändern auf HsH Windows-Rechner', TreeItemCollapsibleState.None, getCommands()[6])]
            : [])
    ];

    dependenciesSettingsjson = [
        new Dependency('settings.json überprüfen', TreeItemCollapsibleState.None, getCommands()[12]),
        new Dependency('settings.json zurücksetzen', TreeItemCollapsibleState.None, getCommands()[2]),
        new Dependency('aktuelle settings.json öffnen', TreeItemCollapsibleState.None, getCommands()[10]),
        new Dependency('alte settings.json öffnen', TreeItemCollapsibleState.None, getCommands()[11])
    ];

    dependenciesTasksjson = [
        new Dependency('tasks.json zurücksetzen', TreeItemCollapsibleState.None, getCommands()[3]),
        new Dependency('aktuelle tasks.json öffnen', TreeItemCollapsibleState.None, getCommands()[13])
    ];

    dependenciesCompiler = [
        ...(getOSBoolean(OS.windows)
        ? [new Dependency('Chocolatey (Zur installation von Compilern)', TreeItemCollapsibleState.Collapsed)] : []),
        new Dependency('C-Compiler', TreeItemCollapsibleState.Collapsed),
        new Dependency('Java-Compiler', TreeItemCollapsibleState.Collapsed),
        new Dependency('Python-Compiler', TreeItemCollapsibleState.Collapsed)
    ];

    dependenciesChocolatey = [
        new Dependency('Chocolatey installieren', TreeItemCollapsibleState.None, getCommands()[17]),
        new Dependency('Chocolatey löschen', TreeItemCollapsibleState.None, getCommands()[18])
    ];

    dependenciesCCompiler = [
        new Dependency('C-Compiler prüfen / installieren', TreeItemCollapsibleState.None, getCommands()[5]),
        new Dependency('C-Compiler deinstallieren', TreeItemCollapsibleState.None, getCommands()[19])
    ];

    dependenciesJavaCompiler = [
        new Dependency('Java-Compiler prüfen / installieren', TreeItemCollapsibleState.None, getCommands()[14]),
        new Dependency('Java-Compiler deinstallieren', TreeItemCollapsibleState.None, getCommands()[20])
    ];

    dependenciesPythonCompiler = [
        new Dependency('Python-Compiler prüfen / installieren', TreeItemCollapsibleState.None, getCommands()[15]),
        new Dependency('Python-Compiler deinstallieren', TreeItemCollapsibleState.None, getCommands()[21])
    ];
}
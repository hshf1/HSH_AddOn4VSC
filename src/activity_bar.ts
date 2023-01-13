import {
    window, Command, TreeDataProvider, TreeViewOptions,
    TreeItemCollapsibleState, EventEmitter, Event, TreeItem
} from 'vscode'
import { constcommands } from './constcommands'
import { githublinks, github_status } from './github'
import { statusbar_button } from './extsettings'
import { quiz_status } from './registercommands'

export let dependencies_link: any = [], dependencies_main: any = []

export class Dependency extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command,
    ) {
        super(label, collapsibleState);
    }
}

export class DepNodeProvider implements TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

    refresh(): void {
        aktualisieren()
        this._onDidChangeTreeData.fire(undefined)
    }

    getTreeItem(element: Dependency): TreeItem {
        return element
    }

    getChildren(element?: Dependency): Thenable<Dependency[]> {
        if (!element) {
            return Promise.resolve(this.getDependencies())
        } else {
            return Promise.resolve(this.getPackageDependencies(element))
        }
    }

    private getDependencies(): Dependency[] {
        return [
            ...dependencies_main
        ]
    }

    private getPackageDependencies(dependency: Dependency): Dependency[] {
        if (dependency.label === 'Einstellungen zurücksetzen') {
            return [
                new Dependency('settings.json zurücksetzen', TreeItemCollapsibleState.None, constcommands[4]),
                new Dependency('tasks.json zurücksetzen', TreeItemCollapsibleState.None, constcommands[5])
            ]
        } else if (dependency.label === 'Übungsaufgaben prüfen') {
            return [
                new Dependency('Aufgabe 1 prüfen', TreeItemCollapsibleState.None, constcommands[6]),
                new Dependency('Aufgabe 2 prüfen', TreeItemCollapsibleState.None, constcommands[7]),
                new Dependency('Aufgabe 3 prüfen', TreeItemCollapsibleState.None, constcommands[8]),
                new Dependency('Aufgabe 4 prüfen', TreeItemCollapsibleState.None, constcommands[9]),
                new Dependency('Aufgabe 5 prüfen', TreeItemCollapsibleState.None, constcommands[10]),
                new Dependency('Aufgabe 6 prüfen', TreeItemCollapsibleState.None, constcommands[11]),
                new Dependency('Aufgabe 7 prüfen', TreeItemCollapsibleState.None, constcommands[12]),
                new Dependency('Aufgabe 8 prüfen', TreeItemCollapsibleState.None, constcommands[13]),
                new Dependency('Aufgabe 9 prüfen', TreeItemCollapsibleState.None, constcommands[14]),
                new Dependency('Aufgabe 10 prüfen', TreeItemCollapsibleState.None, constcommands[15]),
                new Dependency('Aufgabe 11 prüfen', TreeItemCollapsibleState.None, constcommands[16])
            ]
        } else if (dependency.label === 'Nützliche Links') {
            return [
                ...dependencies_link
            ]
        } else {
            return []
        }
    }
}

export const treeDataProvider = new DepNodeProvider();

const treeViewOptions: TreeViewOptions<Dependency> = {
    treeDataProvider: treeDataProvider
}

build_activity_bar()

async function build_activity_bar() {
    aktualisieren()
    while (github_status === undefined) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (github_status === true) {
        for (let i = 0; i < githublinks.length; i++) {
            dependencies_link.push(new Dependency(githublinks[i].name, TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: [githublinks[i].link, githublinks[i].gueltig_bis] }))
        }
    }
    window.registerTreeDataProvider('menue_bar_activity', treeDataProvider)
    window.createTreeView('menue_bar_activity', treeViewOptions)
}

function aktualisieren() {
    dependencies_main = [
        new Dependency('GitHub: Vorlesung C', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VorlesungC', ''] }),
        new Dependency(quiz_status ? 'C-Quiz beenden' : 'C-Quiz starten', TreeItemCollapsibleState.None, constcommands[quiz_status ? 3 : 0]),
        new Dependency((statusbar_button.command === 'extension.off') ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren', TreeItemCollapsibleState.None, constcommands[(statusbar_button.command === 'extension.off') ? 2 : 1]),
        new Dependency('Einstellungen zurücksetzen', TreeItemCollapsibleState.Collapsed),
        //new Dependency('Übungsaufgaben prüfen', TreeItemCollapsibleState.Collapsed),
        new Dependency('Nützliche Links', TreeItemCollapsibleState.Collapsed)
    ]
}
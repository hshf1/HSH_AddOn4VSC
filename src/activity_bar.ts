import {
    window, Command, TreeDataProvider, TreeViewOptions,
    TreeItemCollapsibleState, EventEmitter, Event, TreeItem
} from 'vscode'
import { active_addon } from './status_bar'
import { status_quiz } from './registercommands'
import { constcommands } from './constcommands'

export class DepNodeProvider implements TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

    refresh(): void {
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
        const active_addon_dependency_text = active_addon ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren';
        const quiz_text = status_quiz ? 'C-Quiz beenden' : 'C-Quiz starten';
        return [
            new Dependency(quiz_text, TreeItemCollapsibleState.None, constcommands[status_quiz ? 3 : 0]),
            new Dependency(active_addon_dependency_text, TreeItemCollapsibleState.None, constcommands[active_addon ? 2 : 1]),
            new Dependency('Einstellungen zurücksetzen', TreeItemCollapsibleState.Collapsed, undefined),
            new Dependency('Aufgaben prüfen', TreeItemCollapsibleState.Collapsed, undefined)
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
        } else {
            return []
        }
    }
}

export const treeDataProvider = new DepNodeProvider();

export class Dependency extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command,
    ) {
        super(label, collapsibleState);
    }
}

window.registerTreeDataProvider('menue_bar_activity', treeDataProvider);

const treeViewOptions: TreeViewOptions<Dependency> = {
    treeDataProvider: treeDataProvider
};

window.createTreeView('menue_bar_activity', treeViewOptions);
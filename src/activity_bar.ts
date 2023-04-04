import {
    window, Command, TreeDataProvider, TreeViewOptions,
    TreeItemCollapsibleState, EventEmitter, Event, TreeItem, workspace
} from 'vscode'

import { constcommands } from './constants'
import { getGithubLinks, getGithubStatus } from './github'
import { getStatusBarItem } from './init'

let dependencies_link: any = [], dependencies_main: any = []

class Dependency extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command,
    ) {
        super(label, collapsibleState);
    }
}

class DepNodeProvider implements TreeDataProvider<Dependency> {
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
        if (dependency.label === 'Einstellungen') {
            return [
                new Dependency('settings.json zurücksetzen', TreeItemCollapsibleState.None, constcommands[2]),
                new Dependency('tasks.json zurücksetzen', TreeItemCollapsibleState.None, constcommands[3]),
                new Dependency('Compiler prüfen', TreeItemCollapsibleState.None, constcommands[5]),
                new Dependency(workspace.getConfiguration('addon4vsc').get('computerraum') ? 'Ändern auf privaten Windows-Rechner' : 'Ändern auf HsH Windows-Rechner', TreeItemCollapsibleState.None, constcommands[6])
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

export async function build_activity_bar() {
    aktualisieren()
    while (getGithubStatus() === undefined) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (getGithubStatus() === true) {
        let links = getGithubLinks()
        for (let i = 0; i < links.length; i++) {
            dependencies_link.push(new Dependency(links[i].name, TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: [links[i].link] }))
        }
    }
    window.registerTreeDataProvider('menue_bar_activity', treeDataProvider)
    window.createTreeView('menue_bar_activity', treeViewOptions)
}

function aktualisieren() {
    dependencies_main = [
        new Dependency('GitHub: Vorlesung C', TreeItemCollapsibleState.None, { command: 'open.link', title: 'Öffne Link', arguments: ['https://github.com/hshf1/VorlesungC', ''] }),
        new Dependency((getStatusBarItem().command === 'extension.off') ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren', TreeItemCollapsibleState.None, constcommands[(getStatusBarItem().command === 'extension.off') ? 1 : 0]),
        new Dependency('Einstellungen', TreeItemCollapsibleState.Collapsed),
        new Dependency('Nützliche Links', TreeItemCollapsibleState.Expanded)
    ]
}
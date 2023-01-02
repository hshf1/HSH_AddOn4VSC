import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
import { active_addon, active_addon_func } from './menue';
import { startQuiz, quit_quiz } from './quiz';

export let status_quiz: boolean

const command: vscode.Command[] = [{
    command: 'exam.start',
    title: 'Starte C-Quiz'
},
{
    command: 'extension.on',
    title: "Erweiterung wieder aktivieren"
},
{
    command: "extension.off",
    title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode deaktivieren"
},
{
    command: 'exam.stop',
    title: 'Beende C-Quiz'
}];

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
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
        const active_addon_dependency = active_addon ? command[2] : command[1];
        const active_addon_dependency_text = active_addon ? 'Erweiterung pausieren' : 'Erweiterung wieder aktivieren';
        const quiz_dependency = status_quiz ? command[3] : command[0];
        const quiz_text = status_quiz ? 'C-Quiz beenden' : 'C-Quiz starten';
        return [
            new Dependency(quiz_text, TreeItemCollapsibleState.None, quiz_dependency),
            new Dependency(active_addon_dependency_text, TreeItemCollapsibleState.None, active_addon_dependency)
        ];
    }

    private getPackageDependencies(dependency: Dependency): Dependency[] {
        return [];
    }
}

export const treeDataProvider = new DepNodeProvider();

vscode.commands.registerCommand(command[1].command, () => {
    active_addon_func(true);
    treeDataProvider.refresh();
});
vscode.commands.registerCommand(command[2].command, () => {
    active_addon_func(false);
    treeDataProvider.refresh();
});

vscode.commands.registerCommand(command[0].command, () => {
    status_quiz = true;
    startQuiz();
    treeDataProvider.refresh();
});

vscode.commands.registerCommand(command[3].command, () => {
    status_quiz = false;
    quit_quiz();
    treeDataProvider.refresh();
});

export class Dependency extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}

vscode.window.registerTreeDataProvider('menue_bar_activity', new DepNodeProvider());
const treeViewOptions: vscode.TreeViewOptions<Dependency> = {
    treeDataProvider: treeDataProvider
};

vscode.window.createTreeView('menue_bar_activity', treeViewOptions);
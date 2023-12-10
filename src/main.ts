import { ExtensionContext, ProgressLocation, debug, window, workspace } from 'vscode';

import { installC } from './compiler/c';
import { installJava } from './compiler/java';
import { installPython } from './compiler/python';
import { initFolder } from './functions/CheckFolder';
import { initLogFile } from './functions/LogFile';
import { initCommands } from './functions/Commands';
import { infoNotification } from './functions/Notifications';
import { checkName } from './functions/FileFolderName';
import { OS, getOSBoolean, setOS } from './functions/OS';
import { checkPaths, initPath } from './functions/Paths';
import { initActivityBar } from './functions/ActivityBar';
import { checkSettingsFile } from './functions/Settings';
import { checkTasksFile } from './functions/Tasks';
import { installExtension } from './functions/Utils';

let init = false;

// TODO: https://code.visualstudio.com/docs/cpp/config-mingw hier sind vielleicht bessere wege, um die Erweiterung zu verbessern
// TODO: https://github.com/microsoft/vscode-cmake-tools/blob/main/docs/README.md cmake build für mehrere dateien gleichzeitig kompilieren und eigene bib's

export function activate(context: ExtensionContext): void {
	infoNotification(`HSH_AddOn4VSC gestartet!`);

	window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Initialisierung...',
        cancellable: false,
    }, async () => {
        infoNotification(`Initialisierung beginnt!`);
        setOS();
        initPath();
        initLogFile();
        initFolder();
        initActivityBar();
		installExtension('formulahendry.code-runner');
		installExtension('ms-vsliveshare.vsliveshare');
		installExtension('ms-vscode.cpptools');
		installExtension('vscjava.vscode-java-pack');
		installExtension('ms-python.python');
		if (getOSBoolean(OS.macOS) || getOSBoolean(OS.linux)) {
			installExtension('vadimcn.vscode-lldb');
		}
		installC();
        installJava();
        installPython();
        checkSettingsFile();
        checkTasksFile();
        checkPaths();
    }).then(() => {
        init = true;
        infoNotification(`Initialisierung beendet!`);
    });
	
	initCommands(context);

	workspace.onDidSaveTextDocument(checkName);
	debug.onDidChangeBreakpoints(checkName);
}

export function deactivate(): void {
	infoNotification(`HSH_AddOn4VSC wird ordnungsgemäß beendet!`);
}
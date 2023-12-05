import { commands, env, ExtensionContext, Uri, window } from 'vscode';

import { treeDataProvider } from './ActivityBar';
import { setTasksFile } from './Tasks';
import { reportAProblem } from './Report';
import { getComputerraumConfig, getOSBoolean, OS, setComputerraumConfig } from './OS';
import { switchDirectory } from './FileFolderName';
import { addMissingSettings, setSettingsFile } from './Settings';
import { errorNotification } from './Notifications';
import { installChoco, removeChoco } from '../compiler/chocolatey';
import { installC, uninstallC } from '../compiler/c';
import { installJava, uninstallJava } from '../compiler/java';
import { installPython, uninstallPython } from '../compiler/python';
import { openFile } from './Utils';
import { getLogFilePath } from './LogFile';
import { getPath } from './Paths';
import { getCommands } from '../constants/Commands';

const constregistercommands = [
    {
        name: getCommands()[0].command,
        callback: () => {
            treeDataProvider.refresh();
        }
    },
    {
        name: getCommands()[1].command,
        callback: () => {
            treeDataProvider.refresh();
        }
    },
    {
        name: getCommands()[2].command,
        callback: () => {
            setSettingsFile();
        }
    },
    {
        name: getCommands()[3].command,
        callback: () => {
            setTasksFile();
        }
    },
    {
        name: getCommands()[4].command,
        callback: (...args: any) => {
            if (args[0] === '') {
                errorNotification(`Es wurde kein Link zum Öffnen übergeben!`, true);
                return;
            } else {
                env.openExternal(Uri.parse(args[0]));
            }
        }
    },
    {
        name: getCommands()[5].command,
        callback: () => {
            installC();
        }
    },
    {
        name: getCommands()[6].command,
        callback: async () => {
            const COMPUTERRAUM = getComputerraumConfig();

            if (!getOSBoolean(OS.windows)) {
                window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.');
                return;
            }

            let userSelection = await window.showWarningMessage("Möchtest du wirklich den Standort des Windows-Rechners wechseln?", "Ja", "Nein");

            if (userSelection === "Ja") {
                if (COMPUTERRAUM) {
                    setComputerraumConfig(false);
                    window.showInformationMessage('Auf privater Windows-Rechner gestellt.');
                } else {
                    setComputerraumConfig(true);
                    window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.');
                }

                treeDataProvider.refresh();
            }
        }
    },
    {
        name: getCommands()[7].command,
        callback: async () => {
            reportAProblem();
        }
    },
    // {
    //     name: getConstCommands()[8].command,
    //     callback: () => {
    //         //
    //     }
    // },
    {
        name: getCommands()[9].command,
        callback: () => {
            switchDirectory();
        }
    },
    {
        name: getCommands()[10].command,
        callback: () => {
            const settingsPath = getPath().settingsFile;

            openFile(settingsPath);
        }
    },
    {
        name: getCommands()[11].command,
        callback: () => {
            const oldSettingsPath = getPath().oldSettingsFile;

            openFile(oldSettingsPath);
        }
    },
    {
        name: getCommands()[12].command,
        callback: () => {
            addMissingSettings();
        }
    },
    {
        name: getCommands()[13].command,
        callback: () => {
            const tasksPath = getPath().tasksFile;

            openFile(tasksPath);
        }
    },
    {
        name: getCommands()[14].command,
        callback: () => {
            installJava();
        }
    },
    {
        name: getCommands()[15].command,
        callback: () => {
            installPython();
        }
    },
    {
        name: getCommands()[16].command,
        callback: () => {
            const logFilePath = getLogFilePath();

            openFile(logFilePath);
        }
    },
    {
        name: getCommands()[17].command,
        callback: () => {
            installChoco();
        }
    },
    {
        name: getCommands()[18].command,
        callback: () => {
            removeChoco();
        }
    },
    {
        name: getCommands()[19].command,
        callback: () => {
            uninstallC();
        }
    },
    {
        name: getCommands()[20].command,
        callback: () => {
            uninstallJava();
        }
    },
    {
        name: getCommands()[21].command,
        callback: () => {
            uninstallPython();
        }
    }
];

export function initCommands(context: ExtensionContext): void {
    constregistercommands.forEach(command => {
        context.subscriptions.push(commands.registerCommand(command.name, command.callback));
    });
}
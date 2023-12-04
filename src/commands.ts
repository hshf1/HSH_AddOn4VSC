import { commands, env, ExtensionContext, Uri, window } from 'vscode';

import { treeDataProvider } from './functions/ActivityBar';
import { getConstCommands } from './Constants';
import { openTasksFile, setTasksFile } from './json/Tasks';
import { getComputerraumConfig, setComputerraumConfig } from './init/Init';
import { reportAProblem } from './functions/Report';
import { openLogFile } from './functions/LogFile';
import { getOSBoolean } from './init/OS';
import { switchDirectory } from './functions/FileFolderName';
import { addMissingSettings, openOldSettingsFile, openSettingsFile, setSettingsFile } from './json/Settings';
import { OS } from './init/Init';
import { errorNotification } from './functions/Notifications';
import { installChoco, removeChoco } from './compiler/chocolatey';
import { installC, uninstallC } from './compiler/c';
import { installJava, uninstallJava } from './compiler/java';
import { installPython, uninstallPython } from './compiler/python';

const constregistercommands = [
    {
        name: getConstCommands()[0].command,
        callback: () => {
            treeDataProvider.refresh();
        }
    },
    {
        name: getConstCommands()[1].command,
        callback: () => {
            treeDataProvider.refresh();
        }
    },
    {
        name: getConstCommands()[2].command,
        callback: () => {
            setSettingsFile();
        }
    },
    {
        name: getConstCommands()[3].command,
        callback: () => {
            setTasksFile();
        }
    },
    {
        name: getConstCommands()[4].command,
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
        name: getConstCommands()[5].command,
        callback: () => {
            installC();
        }
    },
    {
        name: getConstCommands()[6].command,
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
        name: getConstCommands()[7].command,
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
        name: getConstCommands()[9].command,
        callback: () => {
            switchDirectory();
        }
    },
    {
        name: getConstCommands()[10].command,
        callback: () => {
            openSettingsFile();
        }
    },
    {
        name: getConstCommands()[11].command,
        callback: () => {
            openOldSettingsFile();
        }
    },
    {
        name: getConstCommands()[12].command,
        callback: () => {
            addMissingSettings();
        }
    },
    {
        name: getConstCommands()[13].command,
        callback: () => {
            openTasksFile();
        }
    },
    {
        name: getConstCommands()[14].command,
        callback: () => {
            installJava();
        }
    },
    {
        name: getConstCommands()[15].command,
        callback: () => {
            installPython();
        }
    },
    {
        name: getConstCommands()[16].command,
        callback: () => {
            openLogFile();
        }
    },
    {
        name: getConstCommands()[17].command,
        callback: () => {
            installChoco();
        }
    },
    {
        name: getConstCommands()[18].command,
        callback: () => {
            removeChoco();
        }
    },
    {
        name: getConstCommands()[19].command,
        callback: () => {
            uninstallC();
        }
    },
    {
        name: getConstCommands()[20].command,
        callback: () => {
            uninstallJava();
        }
    },
    {
        name: getConstCommands()[21].command,
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
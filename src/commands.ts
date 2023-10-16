import { commands, env, ExtensionContext, Uri, window } from 'vscode';

import { treeDataProvider } from './activity_bar';
import { getConstCommands } from './constants';
import { openTasksFile, setTasksFile } from './json/tasks';
import { getComputerraumConfig, setComputerraumConfig } from './init/init';
import { reportAProblem } from './reportaproblem';
import { openLogFile } from './logfile';
import { getOSBoolean } from './init/os';
import { switchDirectory } from './filefoldername';
import { addMissingSettings, openOldSettingsFile, openSettingsFile, setSettingsFile } from './json/settings';
import { setLanguage } from './init/language';
import { OS, ProgLang } from './init/enum';
import { errorNotification, infoNotification } from './notifications';
import { installChoco, removeChoco } from './compiler/chocolatey';
import { installC } from './compiler/c';
import { installJava } from './compiler/java';
import { installPython } from './compiler/python';

const constregistercommands = [
    {
        name: getConstCommands()[0].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[0].command}`);
            treeDataProvider.refresh();
        }
    },
    {
        name: getConstCommands()[1].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[1].command}`);
            treeDataProvider.refresh();
        }
    },
    {
        name: getConstCommands()[2].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[2].command}`);
            setSettingsFile();
        }
    },
    {
        name: getConstCommands()[3].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[3].command}`);
            setTasksFile();
        }
    },
    {
        name: getConstCommands()[4].command,
        callback: (...args: any) => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[4].command}`);
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
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[5].command}`);
            installC();
        }
    },
    {
        name: getConstCommands()[6].command,
        callback: async () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[6].command}`);
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
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[7].command}`);
            reportAProblem();
        }
    },
    {
        name: getConstCommands()[8].command,
        callback: async () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[8].command}`);
            await setLanguage();
        }
    },
    {
        name: getConstCommands()[9].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[9].command}`);
            switchDirectory();
        }
    },
    {
        name: getConstCommands()[10].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[10].command}`);
            openSettingsFile();
        }
    },
    {
        name: getConstCommands()[11].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[11].command}`);
            openOldSettingsFile();
        }
    },
    {
        name: getConstCommands()[12].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[12].command}`);
            addMissingSettings();
        }
    },
    {
        name: getConstCommands()[13].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[13].command}`);
            openTasksFile();
        }
    },
    {
        name: getConstCommands()[14].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[14].command}`);
            installJava();
        }
    },
    {
        name: getConstCommands()[15].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[15].command}`);
            installPython();
        }
    },
    {
        name: getConstCommands()[16].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[16].command}`);
            openLogFile();
        }
    },
    {
        name: getConstCommands()[17].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[17].command}`);
            installChoco();
        }
    },
    {
        name: getConstCommands()[18].command,
        callback: () => {
            infoNotification(`Folgender Command wird ausgeführt: ${getConstCommands()[18].command}`);
            removeChoco();
        }
    }
];

export function initCommands(context: ExtensionContext) {
    constregistercommands.forEach(command => {
        context.subscriptions.push(commands.registerCommand(command.name, command.callback));
    });
}
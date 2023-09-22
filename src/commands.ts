import { commands, env, ExtensionContext, Uri, window } from 'vscode'

import { treeDataProvider } from './activity_bar'
import { getConstCommands } from './constants'
import { openTasksFile, setTasksFile } from './json/tasks'
import { getStatusBarItem, initCompiler, getComputerraumConfig, setComputerraumConfig } from './init/init'
import { reportAProblem } from './reportaproblem'
import { writeLog } from './logfile'
import { getOSBoolean } from './init/os'
import { switch_directory } from './filefoldername'
import { addMissingSettings, openOldSettingsFile, openSettingsFile, setSettingsFile } from './json/settings'
import { set_language } from './language_handler'

const constregistercommands = [
    {
        name: getConstCommands()[0].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[0].command}`, 'INFO')
            getStatusBarItem().text = 'AddOn4VSC pausieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
            getStatusBarItem().command = 'extension.off'
            treeDataProvider.refresh()
        }
    },
    {
        name: getConstCommands()[1].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[1].command}`, 'INFO')
            getStatusBarItem().text = 'AddOn4VSC wieder aktivieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            getStatusBarItem().command = 'extension.on'
            treeDataProvider.refresh()
        }
    },
    {
        name: getConstCommands()[2].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[2].command}`, 'INFO')
            setSettingsFile();
            window.showInformationMessage('settings.json wurde zurückgesetzt.')
        }
    },
    {
        name: getConstCommands()[3].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[3].command}`, 'INFO')
            setTasksFile();
            window.showInformationMessage('tasks.json wurde zurückgesetzt.')
        }
    },
    {
        name: getConstCommands()[4].command,
        callback: (...args: any) => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[4].command}`, 'INFO')
            if (args[0] === '') {
                window.showErrorMessage(writeLog(`Es wurde kein Link zum Öffnen übergeben!`, 'ERROR'))
                return
            } else {
                env.openExternal(Uri.parse(args[0]))
            }
        }
    },
    {
        name: getConstCommands()[5].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[5].command}`, 'INFO')
            initCompiler()
        }
    },
    {
        name: getConstCommands()[6].command,
        callback: async () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[6].command}`, 'INFO')
            const COMPUTERRAUM = getComputerraumConfig()
            if (!getOSBoolean('Windows')) {
                window.showInformationMessage('Diese Einstellung ist nur für Windows-Betriebssysteme notwendig.')
                return
            }

            let userSelection = await window.showWarningMessage("Möchtest du wirklich den Standort des Windows-Rechners wechseln?", "Ja", "Nein")

            if (userSelection === "Ja") {
                if (COMPUTERRAUM) {
                    setComputerraumConfig(false)
                    window.showInformationMessage('Auf privater Windows-Rechner gestellt.')
                } else {
                    setComputerraumConfig(true)
                    window.showInformationMessage('Auf HsH Windows-Rechner im Rechenzentrum gestellt.')
                }

                treeDataProvider.refresh()
            }
        }
    },
    {
        name: getConstCommands()[7].command,
        callback: async () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[7].command}`, 'INFO')
            reportAProblem()
        }
    },
    {
        name: getConstCommands()[8].command,
        callback: async () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[8].command}`, 'INFO')
            await set_language();
        }
    },
    {
        name: getConstCommands()[9].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[9].command}`, 'INFO')
            //window.showWarningMessage(writeLog('Verzeichnis wird gewechselt', 'INFO'))
            switch_directory();
        }
    },
    {
        name: getConstCommands()[10].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[10].command}`, 'INFO')
            openSettingsFile();
        }
    },
    {
        name: getConstCommands()[11].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[11].command}`, 'INFO')
            openOldSettingsFile();
        }
    },
    {
        name: getConstCommands()[12].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[12].command}`, 'INFO')
            addMissingSettings();
        }
    },
    {
        name: getConstCommands()[13].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[13].command}`, 'INFO')
            openTasksFile();
        }
    },
    {
        name: getConstCommands()[14].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[14].command}`, 'INFO')
            window.showInformationMessage('Die Funktion ist derzeit nicht verfügbar!')
        }
    },
    {
        name: getConstCommands()[15].command,
        callback: () => {
            writeLog(`Folgender Command wird ausgeführt: ${getConstCommands()[15].command}`, 'INFO')
            window.showInformationMessage('Die Funktion ist derzeit nicht verfügbar!')
        }
    }
]

export function initCommands(context: ExtensionContext) {
    constregistercommands.forEach(command => {
        context.subscriptions.push(commands.registerCommand(command.name, command.callback))
    })
}
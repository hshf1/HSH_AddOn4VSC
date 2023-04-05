import { env, Uri, window } from 'vscode'

import { treeDataProvider } from './activity_bar'
import { constcommands } from './constants'
import { renewjsons } from './jsonfilescheck'
import { compiler_init, getPath, setRZHsH, getStatusBarItem } from './init'

const constregistercommands = [
    {
        name: constcommands[0].command,
        callback: () => {
            getStatusBarItem().text = 'AddOn4VSC pausieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
            getStatusBarItem().command = 'extension.off'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[1].command,
        callback: () => {
            getStatusBarItem().text = 'AddOn4VSC wieder aktivieren'
            getStatusBarItem().tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            getStatusBarItem().command = 'extension.on'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[2].command,
        callback: () => {
            renewjsons(getPath('settingsjson'))
            window.showInformationMessage('settings.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')

        }
    },
    {
        name: constcommands[3].command,
        callback: () => {
            renewjsons(getPath('tasksjson'))
            window.showInformationMessage('tasks.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')
        }
    },
    {
        name: constcommands[4].command,
        callback: (...args: any) => {
            if (args[0] === '') {
                window.showErrorMessage('Es wurde kein Link zum Öffnen übergeben!')
                return
            } else {
                env.openExternal(Uri.parse(args[0]))
            }
        }
    },
    {
        name: constcommands[5].command,
        callback: () => {
            compiler_init()
        }
    },
    {
        name: constcommands[6].command,
        callback: async () => {
            await setRZHsH()
            treeDataProvider.refresh()
        }
    }
]

export function getCommands() {
    return constregistercommands
}
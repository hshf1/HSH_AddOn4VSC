import { env, Uri, window } from 'vscode'

import { treeDataProvider } from './activity_bar'
import { constcommands } from './constants'
import { renewjsons } from './jsonfilescheck'
import { compiler_init, filePath_settingsjson, filePath_tasksjson, statusbar_button } from './init'

export let active_addon: boolean = true

export const constregistercommands = [
    {
        name: constcommands[0].command,
        callback: () => {
            statusbar_button.text = 'AddOn4VSC pausieren'
            statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
            statusbar_button.command = 'extension.off'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[1].command,
        callback: () => {
            statusbar_button.text = 'AddOn4VSC wieder aktivieren'
            statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            statusbar_button.command = 'extension.on'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[2].command,
        callback: () => {
            renewjsons(filePath_settingsjson)
            window.showInformationMessage('settings.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')

        }
    },
    {
        name: constcommands[3].command,
        callback: () => {
            renewjsons(filePath_tasksjson)
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
        callback: async () => {
            compiler_init()
        }
    }
]
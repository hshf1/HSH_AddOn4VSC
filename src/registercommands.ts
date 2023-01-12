import { treeDataProvider } from './activity_bar'
import { constcommands } from './constcommands'
import { evaluate } from './runexercises'
import { constexercise } from './exercises'
import { filePath_settingsjson, filePath_tasksjson } from './extsettings'
import { renewjsons } from './jsonfilescheck'
import { startQuiz, quit_quiz } from './quiz'
import { active_addon_func } from './status_bar'
import { githubquiz, github_status } from './github'
import { env, Uri, window } from 'vscode'
import { addfunc } from './insertforexercise'

export let sum: number | undefined
export let quiz_status = false

export const constregistercommands = [
    {
        name: constcommands[0].command,
        callback: () => {
            if (githubquiz) {
                quiz_status = true
                startQuiz()
                treeDataProvider.refresh()
            } else if (github_status) {
                window.showWarningMessage(`Das Quiz ist derzeit nicht aktiv. Versuche es zu einem späteren Zeitpunkt erneut!`)
            } else {
                window.showWarningMessage(`Quiz derzeit deaktiviert. Prüfe deine Internetverbindung und starte VSCode erneut.`)
            }
        }
    },
    {
        name: constcommands[1].command,
        callback: () => {
            active_addon_func(true)
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[2].command,
        callback: () => {
            active_addon_func(false)
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[3].command,
        callback: () => {
            quiz_status = false
            quit_quiz()
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[4].command,
        callback: () => {
            renewjsons(filePath_settingsjson)
            window.showInformationMessage('settings.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')

        }
    },
    {
        name: constcommands[5].command,
        callback: () => {
            renewjsons(filePath_tasksjson)
            window.showInformationMessage('tasks.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')
        }
    },
    {
        name: constcommands[6].command,
        callback: async () => {
            await addfunc()
            //await evaluate(constexercise[0], 0)
        }
    },
    {
        name: constcommands[7].command,
        callback: async () => {
            await evaluate(constexercise[1], 1)
        }
    },
    {
        name: constcommands[8].command,
        callback: async () => {
            await evaluate(constexercise[2], 2)
        }
    },
    {
        name: constcommands[9].command,
        callback: async () => {
            await evaluate(constexercise[3], 3)
        }
    },
    {
        name: constcommands[10].command,
        callback: async () => {
            await evaluate(constexercise[4], 4)
        }
    },
    {
        name: constcommands[11].command,
        callback: async () => {
            await evaluate(constexercise[5], 5)
        }
    },
    {
        name: constcommands[12].command,
        callback: async () => {
            await evaluate(constexercise[6], 6)
        }
    },
    {
        name: constcommands[13].command,
        callback: async () => {
            await evaluate(constexercise[7], 7)
        }
    },
    {
        name: constcommands[14].command,
        callback: async () => {
            await evaluate(constexercise[8], 8)
        }
    },
    {
        name: constcommands[15].command,
        callback: async () => {
            await evaluate(constexercise[9], 9)
        }
    },
    {
        name: constcommands[16].command,
        callback: async () => {
            await evaluate(constexercise[10], 10)
        }
    },
    {
        name: 'open.link',
        callback: (...args: any) => {
            if (args[0] === '') {
                window.showErrorMessage('Es wurde kein Link zum Öffnen übergeben!')
                return
            }
            if (args[1] >= new Date(Date.now()).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }) || args[1] === '') {
                env.openExternal(Uri.parse(args[0]))
            } else {
                window.showWarningMessage(`Der Link ist nicht mehr aktiv. Dies sollte bald erneuert werden.`)
            }
        }
    }
]
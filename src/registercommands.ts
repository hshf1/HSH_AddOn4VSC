import { treeDataProvider } from './activity_bar'
import { constcommands } from './constcommands'
import { evaluate } from './runexercises'
import { constexercise } from './exercises'
import { filePath_settingsjson, filePath_tasksjson } from './extsettings'
import { checkjsons, deletejsons } from './jsonfilescheck'
import { information_message } from './output'
import { startQuiz, quit_quiz } from './quiz'
import { active_addon_func } from './status_bar'

export let status_quiz: boolean

export const constregistercommands = [
    {
        name: constcommands[0].command,
        callback: () => {
            status_quiz = true
            startQuiz()
            treeDataProvider.refresh()
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
            status_quiz = false
            quit_quiz()
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[4].command,
        callback: () => {
            deletejsons(filePath_settingsjson)
            checkjsons()
            information_message('settings.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')

        }
    },
    {
        name: constcommands[5].command,
        callback: () => {
            deletejsons(filePath_tasksjson)
            checkjsons()
            information_message('tasks.json wurde zurückgesetzt. Manchmal muss VSCode neu gestartet werden, um einige Änderungen wirksam zu machen.')
        }
    },
    {
        name: constcommands[6].command,
        callback: async () => {
            await evaluate(constexercise[0])
        }
    },
    {
        name: constcommands[7].command,
        callback: async () => {
            await evaluate(constexercise[1])
        }
    },
    {
        name: constcommands[8].command,
        callback: async () => {
            await evaluate(constexercise[2])
        }
    },
    {
        name: constcommands[9].command,
        callback: async () => {
            await evaluate(constexercise[3])
        }
    },
    {
        name: constcommands[10].command,
        callback: async () => {
            await evaluate(constexercise[4])
        }
    },
    {
        name: constcommands[11].command,
        callback: async () => {
            await evaluate(constexercise[5])
        }
    },
    {
        name: constcommands[12].command,
        callback: async () => {
            await evaluate(constexercise[6])
        }
    },
    {
        name: constcommands[13].command,
        callback: async () => {
            await evaluate(constexercise[7])
        }
    },
    {
        name: constcommands[14].command,
        callback: async () => {
            await evaluate(constexercise[8])
        }
    },
    {
        name: constcommands[15].command,
        callback: async () => {
            await evaluate(constexercise[9])
        }
    },
    {
        name: constcommands[16].command,
        callback: async () => {
            await evaluate(constexercise[10])
        }
    }
]
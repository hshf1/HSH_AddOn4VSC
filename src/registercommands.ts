import { treeDataProvider } from './activity_bar'
import { constcommands } from './constcommands'
import { filePath_settingsjson, filePath_tasksjson } from './extsettings'
import { checkjsons, deletejsons } from './jsonfilescheck'
import { information_message } from './output'
import { startQuiz, quit_quiz } from './quiz'
import { active_addon_func } from './status_bar'
import { menue } from './status_bar'

export let status_quiz: boolean

export const constregistercommands = [
    {
        name: constcommands[0].command,
        callback: () => {
            status_quiz = true;
            startQuiz();
            treeDataProvider.refresh();
        }
    },
    {
        name: constcommands[1].command,
        callback: () => {
            active_addon_func(true);
            treeDataProvider.refresh();
        }
    },
    {
        name: constcommands[2].command,
        callback: () => {
            active_addon_func(false);
            treeDataProvider.refresh();
        }
    },
    {
        name: constcommands[3].command,
        callback: () => {
            status_quiz = false;
            quit_quiz();
            treeDataProvider.refresh();
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
        callback: () => {
            menue()
        }
    },
    {
        name: constcommands[7].command,
        callback: () => {

        }
    },
    {
        name: constcommands[8].command,
        callback: () => {

        }
    },
    {
        name: constcommands[9].command,
        callback: () => {

        }
    },
    {
        name: constcommands[10].command,
        callback: () => {

        }
    },
    {
        name: constcommands[11].command,
        callback: () => {

        }
    },
    {
        name: constcommands[12].command,
        callback: () => {

        }
    },
    {
        name: constcommands[13].command,
        callback: () => {

        }
    },
    {
        name: constcommands[14].command,
        callback: () => {

        }
    },
    {
        name: constcommands[15].command,
        callback: () => {

        }
    }
]
import { commands, env, Uri, window } from 'vscode'
import { exec } from 'child_process'

import { treeDataProvider } from './activity_bar'
import { evaluate } from './runexercises'
import { constexercise, constcommands } from './constants'
import { renewjsons } from './jsonfilescheck'
import { startQuiz, quit_quiz } from './quiz'
import { githubquiz, github_status } from './github'
import { addfunc } from './insertforexercise'
import {
    computerraum_hsh, filePath_settingsjson, filePath_tasksjson,
    IS_LINUX, IS_OSX, IS_WINDOWS, statusbar_button, userhomefolder
} from './init'

export let sum: number | undefined
export let quiz_status = false
export let active_addon: boolean = true

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
            statusbar_button.text = 'AddOn4VSC pausieren'
            statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC zu pausieren (spätestens, bis wenn VSCode neu startet)'
            statusbar_button.command = 'extension.off'
            treeDataProvider.refresh()
        }
    },
    {
        name: constcommands[2].command,
        callback: () => {
            statusbar_button.text = 'AddOn4VSC wieder aktivieren'
            statusbar_button.tooltip = 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
            statusbar_button.command = 'extension.on'
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
    },
    {
        name: constcommands[9].command,
        callback: async () => {
            if (!computerraum_hsh || !IS_WINDOWS) {
                exec('gcc --version', (error, stdout) => {
                    if (error) {
                        window.showErrorMessage(`Compiler nicht gefunden, jetzt installieren?`, 'Compiler jetzt installieren', 'Nein').then(selected => {
                            if (selected === 'Compiler jetzt installieren') {
                                commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(userhomefolder)).then(() => {
                                    if (IS_WINDOWS && !computerraum_hsh) {
                                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
                                    } else if (IS_OSX) {
                                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash\n' })
                                    } else if (IS_LINUX) {
                                        commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/vsclinuxosx.sh | bash\n' })
                                    }
                                })
                                window.showWarningMessage(`Nach Beendigung der Installation muss VSCode meistens neu gestartet werden!`, 'Jetzt neu starten', 'Später neu starten').then(selected => {
                                    if (selected === 'Jetzt neu starten') {
                                        commands.executeCommand('workbench.action.reloadWindow')
                                    }
                                })
                            }
                        })
                    } else {
                        window.showInformationMessage(`Compiler bereits installiert`)
                    }
                })
            } else {
                window.showErrorMessage('Diese Aktion kann nicht im RZ der HsH ausgeführt werden!')
            }
        }
    }
]
import { OutputChannel, commands, window, Disposable } from 'vscode'
import { menue_button } from './extsettings';
import { status_quiz } from './registercommands';
import { questions } from './quizqestions'
import { error } from 'console';

let quizOutputChannel: OutputChannel
let active_quickpick1: any
let currentQuestionIndex: number
let score: number
let selectedanswer: string

async function showNextQuestion(quizOutputChannel: OutputChannel) {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex].question
        const items = questions[currentQuestionIndex].answers.map(answer => ({ label: answer }))
        items.push({ label: 'C-Quiz beenden' })
        quizOutputChannel.appendLine(question)
        active_quickpick1 = await quiz_showQuickPick(question, items).catch(error)
        if (status_quiz) {
            if (selectedanswer === questions[currentQuestionIndex].correctAnswer) {
                score++;
                quizOutputChannel.appendLine(`${selectedanswer} ist richtig!\nAktuelle Punktzahl: ${score} von ${questions.length} Punkten.\n\n`)
            } else if (selectedanswer === 'C-Quiz beenden') {
                commands.executeCommand('exam.stop')
                return 0
            } else {
                quizOutputChannel.appendLine(`${selectedanswer} ist falsch!\nAktuelle Punktzahl: ${score} von ${questions.length} Punkten.\n\n`)
            }
            currentQuestionIndex++

            if (quizOutputChannel) {
                showNextQuestion(quizOutputChannel)
            } else {
                disposeQuickPick()
            }

        } else {
            let items2: {
                label: string
            }[] = [
                    { label: 'C-Quiz beenden' },
                    { label: 'C-Quiz neu starten' }
                ]
            quizOutputChannel.appendLine(`Du hast ${score} Punkte von insgesamt ${questions.length} erreicht.\nC-Quiz beenden oder neu starten?`)
            await window.showQuickPick(items2, {
                ignoreFocusOut: true,
                placeHolder: 'C-Quiz beenden oder neu starten?'
            }).then(selectedOption => {
                if (selectedOption) {
                    if (selectedOption.label === 'C-Quiz beenden') {
                        commands.executeCommand('exam.stop')
                        return 0
                    } else {
                        quizOutputChannel.dispose()
                        window.showInformationMessage('C-Quiz neu gestartet!')
                        commands.executeCommand('exam.start')
                    }
                }
            })
        }
    }
}

export function startQuiz() {
    if (status_quiz) {
        currentQuestionIndex = 0
        score = 0
        menue_button.hide()
        quizOutputChannel = window.createOutputChannel('C-Quiz')
        quizOutputChannel.appendLine('Willkommen beim C-Quiz! Es geht los:')
        quizOutputChannel.show()
        showNextQuestion(quizOutputChannel)
    }
}

export function quit_quiz() {
    if (!status_quiz) {
        quizOutputChannel?.dispose()
        disposeQuickPick()
        menue_button.show()
        window.showInformationMessage('C-Quiz beendet!')
    }
}

async function quiz_showQuickPick(question: string, items: { label: string }[]) {
    const quickpick = await window.showQuickPick(items, {
        placeHolder: question,
        ignoreFocusOut: true
    })
    if (quickpick && status_quiz) {
        selectedanswer = quickpick?.label
    }
}

export function disposeQuickPick() {
    if (active_quickpick1 instanceof Disposable) {
        active_quickpick1.dispose()
    }
}
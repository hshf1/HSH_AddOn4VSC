import { OutputChannel, commands, window, Disposable } from 'vscode'
import { status_quiz } from './registercommands';
import { questions } from './quizqestions'
import { error } from 'console';

let quizOutputChannel: OutputChannel
let active_quickpick1: any
let currentQuestionIndex: number
let score: number
let selectedanswer: string

export function startQuiz() {
    if (status_quiz) {
        currentQuestionIndex = 0
        score = 0
        quizOutputChannel = window.createOutputChannel('C-Quiz')
        quizOutputChannel.show()
        quizOutputChannel.appendLine('Willkommen beim C-Quiz! Es geht los:')
        showNextQuestion()
    }
}

export function quit_quiz() {
    if (!status_quiz) {
        quizOutputChannel?.dispose()
        if (active_quickpick1 instanceof Disposable) {
            active_quickpick1.dispose()
        }
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

async function showNextQuestion() {
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
                showNextQuestion()
            } else {
                commands.executeCommand('exam.stop')
            }
        }

    } else {
        quizOutputChannel.appendLine(`Du hast ${score} Punkte von insgesamt ${questions.length} erreicht.\nC-Quiz beenden oder neu starten?`)

        let items2: {
            label: string
        }[] = [
                { label: 'C-Quiz beenden' },
                { label: 'C-Quiz neu starten' }
            ]
        active_quickpick1 = await quiz_showQuickPick('C-Quiz beenden oder neu starten?', items2)

        if (status_quiz) {
            switch (selectedanswer) {
                case 'C-Quiz beenden':
                    commands.executeCommand('exam.stop')
                    break
                case 'C-Quiz neu starten':
                    window.showInformationMessage('C-Quiz neu gestartet!')
                    commands.executeCommand('exam.start')
                    break
                default:
                    break
            }
        }
    }
}
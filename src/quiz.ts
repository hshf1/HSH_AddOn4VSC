import { OutputChannel, commands, window, QuickPick, QuickPickItem } from 'vscode'
import { githubquiz } from './github'

let quizOutputChannel: OutputChannel
let active_quickpick1: QuickPick<QuickPickItem>;
let score: number, currentIndex: number
let githubquiz_shuffeld: { question: string, answers: string[], correctAnswer: string }[] = []

export function startQuiz() {
    githubquiz_shuffeld = shuffleArray(githubquiz)
    for (let i = 0; i < githubquiz_shuffeld.length; i++) {
        githubquiz_shuffeld[i].answers.sort(() => Math.random() - 0.5)
    }

    currentIndex = 0, score = 0
    quizOutputChannel = window.createOutputChannel('C-Quiz')
    quizOutputChannel.show()
    quizOutputChannel.appendLine(`Willkommen beim C-Quiz!\nEs befinden sich derzeit ${githubquiz.length} Fragen im C-Quiz.\nEs geht los:\n`)

    active_quickpick1 = window.createQuickPick()
    active_quickpick1.show()
    active_quickpick1.ignoreFocusOut = true

    showquestion()
}

function shuffleArray(arr: { question: string, answers: string[], correctAnswer: string }[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function quit_quiz() {
    quizOutputChannel?.dispose()
    active_quickpick1?.dispose()
    window.showInformationMessage('C-Quiz beendet!')
}

function showquestion() {
    if (currentIndex < githubquiz_shuffeld.length) {
        const question = githubquiz_shuffeld[currentIndex].question
        const items: QuickPickItem[] = githubquiz_shuffeld[currentIndex].answers.map(answer => ({ label: answer }))
        items.push({ label: 'C-Quiz beenden' })

        quizOutputChannel.appendLine(question)
        active_quickpick1.placeholder = question
        active_quickpick1.items = items
        active_quickpick1.onDidAccept(() => {
            const selectedAnswer = active_quickpick1.selectedItems[0].label
            if (selectedAnswer === 'C-Quiz beenden') {
                commands.executeCommand('exam.stop')
            } else if (selectedAnswer === githubquiz_shuffeld[currentIndex].correctAnswer) {
                score++
                quizOutputChannel.appendLine(`${selectedAnswer} ist richtig!\nAktueller Stand: ${score} von ${githubquiz_shuffeld.length} richtig beantwortet.\n\n`)
            } else {
                quizOutputChannel.appendLine(`${selectedAnswer} ist falsch!\nAktueller Stand: ${score} von ${githubquiz_shuffeld.length} richtig beantwortet.\n\n`)
            }
            active_quickpick1.selectedItems = []
            currentIndex++
            showquestion()
        })
    } else { endpoint_quiz() }
}

function endpoint_quiz() {

    quizOutputChannel.appendLine(`${score} richtige Antworten von insgesamt ${githubquiz_shuffeld.length}.\nC-Quiz beenden oder neu starten?`)

    let items2: {
        label: string
    }[] = [
            { label: 'C-Quiz beenden' },
            { label: 'C-Quiz neu starten' }
        ]
    active_quickpick1.placeholder = 'C-Quiz beenden oder neu starten?'
    active_quickpick1.items = items2

    active_quickpick1.onDidAccept(() => {
        if (active_quickpick1.selectedItems[0].label === 'C-Quiz beenden') {
            commands.executeCommand('exam.stop')
        } else if (active_quickpick1.selectedItems[0].label === 'C-Quiz neu starten') {
            window.showInformationMessage('C-Quiz neu gestartet!')
            commands.executeCommand('exam.start')
        }
        active_quickpick1.selectedItems = []
    })
}
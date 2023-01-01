import * as vscode from 'vscode'
import { questions } from './quizqestions'

export const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
button.text = 'C-Quiz starten';
button.tooltip = 'Klicken, um C-Quiz zu starten';
button.command = 'exam.start';
button.show();

export function startQuiz() {

    button.hide()

    const quizOutputChannel = vscode.window.createOutputChannel('C-Quiz');

    quizOutputChannel.appendLine('Willkommen beim C-Quiz! Es geht los:');
    quizOutputChannel.show();

    let score = 0;
    let currentQuestionIndex = 0;
    showNextQuestion()

    function showNextQuestion() {
        // Check if there are more questions
        if (currentQuestionIndex < questions.length) {
            // Get the current question
            const question = questions[currentQuestionIndex];
            quizOutputChannel.appendLine(question.question)
            // Create an array of items for the quick pick
            const items = question.answers.map(answer => ({ label: answer }));
            items.push({ label: 'C-Quiz beenden' })
            // Display the quick pick
            vscode.window.showQuickPick(items, {
                ignoreFocusOut: true,
                placeHolder: question.question
            }).then(selectedOption => {
                if (selectedOption) {
                    // Check if the selected answer is correct
                    if (selectedOption.label === question.correctAnswer) {
                        score++;
                        quizOutputChannel.appendLine(`Gewählte Antwort: ${selectedOption.label} ist richtig!`)
                        vscode.window.showInformationMessage(`${selectedOption.label} ist die richtige Antwort! :-)`);
                    } else if (selectedOption.label === 'C-Quiz beenden') {
                        quizOutputChannel.dispose()
                        button.show()
                        vscode.window.showInformationMessage('C-Quiz beendet!')
                    } else {
                        quizOutputChannel.appendLine(`Gewählte Antwort: ${selectedOption.label} ist falsch!`)
                        vscode.window.showWarningMessage(`${selectedOption.label} ist die falsche Antwort! :-(`);
                    }

                    // Update the current question index
                    currentQuestionIndex++;

                    // Show the next question
                    showNextQuestion();
                }
            });
        } else {
            let items2: {
                label: string
            }[] = []
            items2.push({ label: 'C-Quiz beenden' }, { label: 'C-Quiz neu starten' })
            quizOutputChannel.appendLine(`Du hast ${score} Punkte von insgesamt ${questions.length} erreicht.\nC-Quiz beenden oder neu starten?`)
            vscode.window.showQuickPick(items2, {
                ignoreFocusOut: true,
                placeHolder: 'C-Quiz beenden oder neu starten?'
            }).then(selectedOption => {
                if (selectedOption) {
                    // Check if the selected answer is correct
                    if (selectedOption.label === 'C-Quiz beenden') {
                        quizOutputChannel.dispose()
                        button.show()
                        vscode.window.showInformationMessage('C-Quiz beendet!')
                    } else {
                        quizOutputChannel.dispose()
                        vscode.window.showInformationMessage('C-Quiz neu gestartet!')
                        startQuiz()
                    }
                }
            })
        }
    }
}
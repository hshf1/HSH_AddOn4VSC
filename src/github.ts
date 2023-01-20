import { get } from 'request'
import { window } from 'vscode'

export let githublinks: { link: string, name: string, gueltig_bis?: string }[] = []
export let githubquiz: { question: string, answers: string[], correctAnswer: string }[] = []
export let github_status: boolean | undefined = undefined

get('https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/AddOn4VSC/links.txt', (error, response, body) => {
    if (error) {
        console.error(error)
        github_status = false
        window.showWarningMessage(`Einstellungen aus GitHub konnten nicht geladen werden. Einige Zusatzfunktionen sind deaktiviert, prüfen Sie Ihre Internetverbindung.`)
    } else {
        const elements = body.replace(/[\n]/g, '').split('<-')
        let currentLink: { link: string, name: string, gueltig_bis?: string } = { link: "", name: "", gueltig_bis: "" }
        for (const element of elements) {
            const [property, value] = element.split('->')
            if (property.startsWith('name')) {
                currentLink.name = value.trim()
            } else if (property.startsWith('link')) {
                currentLink.link = value.trim()
                githublinks.push(currentLink)
                currentLink = { link: "", name: "", gueltig_bis: "" }
            } /* else if (property.startsWith('gueltig_bis')) {
                currentLink.gueltig_bis = value.trim()
                githublinks.push(currentLink)
                currentLink = { link: "", name: "", gueltig_bis: "" }
            } */
        }
        github_status = true
    }
})

/*
get('https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/AddOn4VSC/quiz.txt', (error, response, body) => {
    if (error) {
        console.error(error)
        github_status = false
        window.showWarningMessage(`Einstellungen aus GitHub konnten nicht geladen werden. Einige Zusatzfunktionen sind deaktiviert, prüfen Sie Ihre Internetverbindung.`)
    } else {
        const quizelements = body.replace(/[\n]/g, '').split('<-')
        let currentQuestion: { question: string, answers: string[], correctAnswer: string } = { question: "", answers: [], correctAnswer: "" }
        for (const quizelement of quizelements) {
            const [quizproperty, quizvalue] = quizelement.split('->')
            if (quizproperty.startsWith('frage')) {
                currentQuestion.question = quizvalue.trim()
            } else if (quizproperty.startsWith('antworten')) {
                currentQuestion.answers = quizvalue.split(',').map((item: string) => item.trim())
            } else if (quizproperty.startsWith('lösung')) {
                currentQuestion.correctAnswer = quizvalue.trim()
                githubquiz.push(currentQuestion)
                currentQuestion = { question: "", answers: [], correctAnswer: "" }
            }
        }
    }
})
*/
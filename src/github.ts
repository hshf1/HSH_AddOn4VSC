import { get } from 'request'
import { warning_message } from './output'

export const githubsettings = {} as { [key: string]: any }
export let github_status: boolean | undefined = undefined

get('https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/AddOn4VSC/links.ts', (error, response, body) => {
    if (error) {
        console.error(error)
        github_status = false
        warning_message(`Einstellungen aus GitHub konnten nicht geladen werden. Einige Zusatzfunktionen sind deaktiviert, prüfen Sie Ihre Internetverbindung.`)
    } else {
        const elements = body.replace(/["\n]/g, '').split(';')
        for (const element of elements) {
            const [property, value] = element.split(' = ')
            githubsettings[property] = value
        }
        github_status = true
    }
})
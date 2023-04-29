/** Dieses Modul hat die Aufgabe sich mit GitHub zu verbinden und die "nützlichen Links" zu kopieren und richtig einzuspeichern */

import { get } from 'request' /** Importiert die get Funktion aus dem Node.js Modul, damit lassen sich URL's aufrufen */
import { writeLog } from './logfile'

let githublinks: { link: string, name: string }[] = [] /** Definiert ein Objekt Array mit den Eigenschaten "link und "name" für dei einzelnen Links  */

/** Globale Funktion die die GitHub Links zurückgeben kann */
export function getGithubLinks(): Promise<{ link: string, name: string }[]> {
    return new Promise((resolve, reject) => {
        get('https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/links.txt', (error, response, body) => {
            if (error) {
                writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
                reject(error)
            } else {
                const elements = body.replace(/[\n]/g, '').split('<-')
                let currentLink: { link: string, name: string } = { link: "", name: "" }
                for (const element of elements) {
                    const [property, value] = element.split('->')
                    if (property.startsWith('name')) {
                        currentLink.name = value.trim()
                    } else if (property.startsWith('link')) {
                        currentLink.link = value.trim()
                        githublinks.push(currentLink)
                        currentLink = { link: "", name: "" }
                    }
                }
                resolve(githublinks);
            }
        })
    })
}
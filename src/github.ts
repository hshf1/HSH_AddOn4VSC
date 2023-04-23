/** Dieses Modul hat die Aufgabe sich mit GitHub zu verbinden und die "nützlichen Links" zu kopieren und richtig einzuspeichern */

import { get } from 'request' /** Importiert die get Funktion aus dem Node.js Modul, damit lassen sich URL's aufrufen */

let githublinks: { link: string, name: string }[] = [] /** Definiert ein Objekt Array mit den Eigenschaten "link und "name" für dei einzelnen Links  */
let github_status: boolean | undefined = undefined  //* Definiert eine Variable die den Status der Verbindung zum GitHub Server wieder gibt */

get('https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/links.txt', (error, response, body) => {
/** Versucht die URL aufzurufen, falls ein Fehler entsteht wird der in Error gespeichert, response enthält das HTTP response Objekt und der Body enthält den body als String */
    if (error) { /** Wenn ein Fehler aufgetreten ist, wird der ausgegeben und der Status wird auf false gesetzt */
        console.error(error)
        github_status = false
    } else {
        const elements = body.replace(/[\n]/g, '').split('<-') /** Entfernt die Zeilenumbrüche und trennt die Kette an den Stellen "<-" in ein Array auf  */
        let currentLink: { link: string, name: string } = { link: "", name: "" } /** Erzeugt Objekt mit Eigenschaften link und name und stellt sicher das beide Argumente leer sind */
        for (const element of elements) {   /** For Schleife durch die aufgetrenten Elemente */
            const [property, value] = element.split('->') /** Erzeugt neues Objekt mit den Eigenschaften property und value, danach trennt es das Element nochmals auf und speichert es in das neue Objekt */
            if (property.startsWith('name')) { /** Wenn property name enthält wird der name getrimmed (whitespace entfernt) und eingespeichert */
                currentLink.name = value.trim()
            } else if (property.startsWith('link')) {/** Wenn property link enthält wird der link getrimmed (whitespace entfernt) und eingespeichert */
                currentLink.link = value.trim()
                githublinks.push(currentLink) /** Das Objekt wird nun an GithubLinks übergeben  */
                currentLink = { link: "", name: "" } /** Currentlink wird wieder zurückgesetzt */
            }
        }
        github_status = true    /** Wenn alle Links eingelesen sind wird der Status auf true gesetzt */
    }
})

export function getGithubStatus() { /** Globale Funktion die den Github Status zurückgeben kann*/ 
    return github_status
}

export function getGithubLinks() {  /** Globale Funktion die die GitHub Links zurückgeben kann*/ 
    return githublinks
}
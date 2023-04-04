import { get } from 'request'

let githublinks: { link: string, name: string }[] = []
let github_status: boolean | undefined = undefined

get('https://raw.githubusercontent.com/hshf1/VorlesungC/main/VSCode/Quellcodes/AddOn4VSC/links.txt', (error, response, body) => {
    if (error) {
        console.error(error)
        github_status = false
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
        github_status = true
    }
})

export function getGithubStatus() {
    return github_status
}

export function getGithubLinks() {
    return githublinks
}
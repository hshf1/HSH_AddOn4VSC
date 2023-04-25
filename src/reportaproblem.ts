/** Noch nicht kommentieren, Funktion noch nicht fertig - CK */
// TODO: Code effizienter und lessbarer schreiben
// TODO: Try-Catch Blöcke definieren

import {
    Terminal, commands,
    env, window
} from "vscode"
import { promisify } from 'util'
import { exec } from 'child_process'
import { join } from "path"
import { promises } from "fs"
import { tmpdir } from "os"
import { createTransport } from "nodemailer"

import { getSmtpEMail, getSmtpHost, getSmtpPW, getSmtpPort } from "./smtpconfig"
import { getOS, getPath } from "./init"
import { logFileName, logFilePath } from "./logfile"

const execAsync = promisify(exec)

export async function reportAProblem() {
    let userReport: {
        mail: string, problem: string, scPermission: string, codeAttachPermission: string,
        scFilePath: string, terminalContentPath: string
    } = {
        mail: "",
        problem: "",
        scPermission: "",
        codeAttachPermission: "",
        scFilePath: "",
        terminalContentPath: ""
    }

    try {
        await userReportInput(userReport)
        if (userReport.scPermission === 'Ja') {
            await getScreenshot(userReport)
        }
        await getTerminalContent(userReport)
        await sendReport(userReport)
    } catch(error) {

    }
}

async function userReportInput(userReport: { mail: string; problem: string; scPermission: string; codeAttachPermission: string; scFilePath: string; terminalContentPath: string }) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    userReport.mail = await window.showInputBox({
        prompt: `Bitte E-Mail Adresse für künftige Korrespondenz angeben. Eine Kopie dieser Problemmeldung wird an die angegebene E-Mail Adresse gesendet.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "max@mustermail.de (Pflichtfeld)",
        ignoreFocusOut: true
    }) || ''
    userReport.mail = userReport.mail.trim()
    if (!emailPattern.test(userReport.mail)) {
        window.showWarningMessage("Problem melden wurde abgebrochen. Bitte eine richtige E-Mail Adresse angeben!")
        throw new Error
    }

    userReport.problem = await window.showInputBox({
        prompt: `Bitte beschreibe dein Problem.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "Hier reinschreiben...",
        ignoreFocusOut: true
    }) || ''

    userReport.scPermission = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll ein Screenshot von VSCode mitangehängt werden? (gesamter Bildschirm wird gecaptured!)',
        ignoreFocusOut: true
    }) || 'Nein'

    userReport.codeAttachPermission = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll die aktiv geöffnete Datei in VSCode mitgesendet werden?',
        ignoreFocusOut: true
    }) || 'Nein'

}

async function getScreenshot(userReport: { mail: string; problem: string; scPermission: string; codeAttachPermission: string; scFilePath: string; terminalContentPath: string }) {
    try {
        userReport.scFilePath = join(tmpdir(), `screenshot_${Date.now()}.png`)
        // TODO: ggf. möglichkeit bieten, ganzen Bildschirm oder nur VSC Window zu screenshotten?
        if (getOS("WIN")) {
            await execAsync(`powershell -Command "& { Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('%{PRTSC}'); Start-Sleep -Milliseconds 250; $image = [System.Windows.Forms.Clipboard]::GetImage(); $image.Save('${userReport.scFilePath}'); }"`)
        } else if (getOS("MAC")) {
            await execAsync(`screencapture "${userReport.scFilePath}"`) // TODO: Derzeit gesamter Bildschirm - ändern, dass nur VSC Window gecaptured wird
        } else if (getOS("LIN")) {
            await execAsync(`gnome-screenshot -f "${userReport.scFilePath}"`) // TODO: Linux muss noch getestet werden
        } else {
            throw new Error(`Ungültige Plattform: ${process.platform}`)
        }
    } catch (error) {
        // TODO: vll error message mit ausgeben lassen? 
        window.showWarningMessage("Screenshot konnte nicht automatisch aufgenommen werden. Geben Sie die Rechte für VSCode frei und versuchen Sie es erneut!")
    }
}

async function sendReport(userReport: { mail: string; problem: string; scPermission: string; codeAttachPermission: string; scFilePath: string; terminalContentPath: string }) {
    const sendPermission = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll die Meldung des Problems nun abgeschickt werden?',
        ignoreFocusOut: true
    }) || 'Nein'

    if (sendPermission === 'Nein') {
        window.showInformationMessage('Problem melden abgebrochen!')
        return
    }

    const activeFilePaths: { filename: string, path: string }[] = getActiveEditorFilepaths()
    const attachActiveFiles = activeFilePaths.map(obj => ({ filename: obj.filename, path: obj.path }))

    const transporter = createTransport({
        host: getSmtpHost(),
        port: getSmtpPort(),
        secure: true,
        auth: {
            user: getSmtpEMail(),
            pass: getSmtpPW(),
        }
    })

    const mailOptions = {
        from: userReport.mail,
        to: getSmtpEMail(),
        cc: userReport.mail,
        subject: 'VSCode Problem',
        text: `Bitte keine Dateien oder Programme ausführen!\nSollte ein Code mitgeschickt worden sein, immer stets überprüfen vor dem Ausführen!\n\nFolgendes Problem wurde vom Nutzer ${userReport.mail} gemeldet:\n\n${userReport.problem}`,
        attachments: [
            {
                filename: logFileName,
                path: logFilePath
            },
            {
                filename: 'terminalcontent.txt',
                path: userReport.terminalContentPath,
            },
            {
                filename: 'settings.json',
                path: getPath('settingsjson')
            },
            {
                filename: 'tasks.json',
                path: getPath('tasksjson')
            },
            ...(userReport.scPermission
                ? [
                    {
                        filename: 'screenshot.png',
                        path: userReport.scFilePath,
                    },
                ] : []),
            ...(userReport.codeAttachPermission
                ? [
                    ...attachActiveFiles,
                ]
                : []),
        ]
        // TODO: eigene Dateien anhängen erlauben? Wozu? Sicherheitsbedenken?
    }

    await transporter.sendMail(mailOptions)
    window.showInformationMessage('Problem erfolgreich gemeldet!')
}

async function getTerminalContent(userReport: { mail: string; problem: string; scPermission: string; codeAttachPermission: string; scFilePath: string; terminalContentPath: string }) {
    try {
        userReport.terminalContentPath = join(tmpdir(), `logs_${Date.now()}.txt`)
        const terminalContents = await captureAllTerminalContents()
        let fileContents = ''

        for (const [terminalName, terminalContent] of terminalContents.entries()) {
            fileContents += `Terminal: ${terminalName}\nInhalt: ${terminalContent}\n`
        }

        await promises.writeFile(userReport.terminalContentPath, fileContents)
    } catch (error) {
        console.error(error)
    }
}

async function captureAllTerminalContents(): Promise<Map<string, string>> {
    const terminalMap = new Map<string, string>()
    const terminals = window.terminals

    for (const terminal of terminals) {
        await terminal.processId
        const terminalName = terminal.name
        const terminalContent = await copyToClipboard(terminal)
        terminalMap.set(terminalName, terminalContent)
    }

    return terminalMap
}

async function copyToClipboard(terminal: Terminal): Promise<string> {
    await commands.executeCommand('workbench.action.terminal.focusNext')
    await commands.executeCommand('workbench.action.terminal.selectAll')
    await commands.executeCommand('workbench.action.terminal.copySelection')
    await commands.executeCommand('workbench.action.terminal.clearSelection')

    const text = await env.clipboard.readText()

    return text || 'Dieses Terminal hat keinen Inhalt'
}

function getActiveEditorFilepaths(): { filename: string, path: string }[] {
    // FIXME: Aktuelle Dateien pro geöffnetem Editor wird angehängt
    const activeEditor = window.activeTextEditor
    if (!activeEditor) {
        return []
    }
    const document = activeEditor.document
    const filePaths = [{ filename: document.fileName.split('\\').pop()!, path: document.fileName }] //TODO: Ist es sinnvoll den Dateinamen ohne die vorherigen Ordnernamen anzugeben?
    for (let i = 0; i < window.visibleTextEditors.length; i++) {
        const editor = window.visibleTextEditors[i]
        if (editor !== activeEditor) {
            const document = editor.document
            filePaths.push({ filename: document.fileName.split('\\').pop()!, path: document.fileName }) //TODO: Ist es sinnvoll den Dateinamen ohne die vorherigen Ordnernamen anzugeben?
        }
    }
    return filePaths
}
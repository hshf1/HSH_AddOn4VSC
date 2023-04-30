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
import { getLogFileName, getLogFilePath, writeLog } from "./logfile"

const execAsync = promisify(exec)

interface UserReport {
    mail: string
    problem: string
    codeAttachPermission: string
    terminalContentPath: string
    screenshot: {
        permission: string
        filePath: string
    }
    attachments: {
        filename: string
        path: string
    }[]
}

export async function reportAProblem() {
    let userReport: UserReport = {
        mail: "", problem: "", codeAttachPermission: "", terminalContentPath: "",
        screenshot: { permission: "", filePath: "" }, attachments: []
    }

    try {
        await userReportInput(userReport)
        if (userReport.screenshot.permission === 'Ja') {
            await getScreenshot(userReport)
        }
        await getTerminalContent(userReport)
        await getAttachments(userReport)
        await sendReport(userReport)
    } catch(error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

async function userReportInput(userReport: UserReport) {
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
        throw new Error('Eingegebene E-Mail Adresse ist ungültig, melden eines Problems abgebrochen!')
    }

    userReport.problem = await window.showInputBox({
        prompt: `Bitte beschreibe dein Problem.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "Hier reinschreiben...",
        ignoreFocusOut: true
    }) || ''

    userReport.screenshot.permission = await window.showQuickPick(['Ja', 'Nein'], {
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

async function getScreenshot(userReport: UserReport) {
    try {
        userReport.screenshot.filePath = join(tmpdir(), `screenshot_${Date.now()}.png`)
        // TODO: ggf. Möglichkeit bieten, ganzen Bildschirm oder nur VSC Window zu screenshotten?
        if (getOS("WIN")) {
            await execAsync(`powershell -Command "& { Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('%{PRTSC}'); Start-Sleep -Milliseconds 250; $image = [System.Windows.Forms.Clipboard]::GetImage(); $image.Save('${userReport.screenshot.filePath}'); }"`)
        } else if (getOS("MAC")) {
            await execAsync(`screencapture "${userReport.screenshot.filePath}"`) // TODO: Derzeit gesamter Bildschirm - ändern, dass nur VSC Window gecaptured wird
        } else if (getOS("LIN")) {
            await execAsync(`gnome-screenshot -f "${userReport.screenshot.filePath}"`) // TODO: Linux muss noch getestet werden
        } else {
            throw new Error(`Ungültige Plattform: ${process.platform}`)
        }
    } catch (error) {
        window.showWarningMessage("Screenshot konnte nicht automatisch aufgenommen werden. Geben Sie die Rechte für VSCode frei und versuchen Sie es erneut!")
        writeLog(`Fehler beim erstellen eines Screenshots für Problemreport: ${error}`, 'ERROR')
    }
}

async function getAttachments(userReport: UserReport) {
    userReport.attachments.push({ filename: getLogFileName(), path: getLogFilePath() })
    userReport.attachments.push({ filename: 'terminalcontent.txt', path: userReport.terminalContentPath })
    userReport.attachments.push({ filename: 'settings.json', path: await getPath('settingsjson') })
    userReport.attachments.push({ filename: 'tasks.json', path: await getPath('tasksjson') })
    
    if (userReport.screenshot.permission) {
        userReport.attachments.push({ filename: 'screenshot.png', path: userReport.screenshot.filePath })
    }
    
    if (userReport.codeAttachPermission) {
        const activeFilePaths: { filename: string, path: string }[] = getActiveEditorFilepaths()
        const attachActiveFiles = activeFilePaths.map(obj => ({ filename: obj.filename, path: obj.path }))
        for (const obj of attachActiveFiles) {
            userReport.attachments.push(obj)
        }
    }
}

async function sendReport(userReport: UserReport) {
    const sendPermission = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll die Meldung des Problems nun abgeschickt werden?',
        ignoreFocusOut: true
    }) || 'Nein'

    if (sendPermission === 'Nein') {
        window.showInformationMessage('Problem melden abgebrochen!')
        return
    }

    const transporter = createTransport({
        host: getSmtpHost(),
        port: getSmtpPort(),
        secure: true,
        auth: {
            user: getSmtpEMail(),
            pass: setString(getSmtpPW(), 15),
        }
    })

    const mailOptions = {
        from: userReport.mail,
        to: getSmtpEMail(),
        cc: userReport.mail,
        subject: 'VSCode Problem',
        text: `Bitte keine Dateien oder Programme ausführen!\nSollte ein Code mitgeschickt worden sein, immer stets überprüfen vor dem Ausführen!\n\nFolgendes Problem wurde vom Nutzer ${userReport.mail} gemeldet:\n\n${userReport.problem}`,
        attachments: userReport.attachments
        // TODO: eigene Dateien anhängen erlauben? Wozu? Sicherheitsbedenken?
    }

    await transporter.sendMail(mailOptions)
    
    window.showInformationMessage(writeLog('Problem erfolgreich gemeldet!', 'INFO'))
}

async function getTerminalContent(userReport: UserReport) {
    try {
        userReport.terminalContentPath = join(tmpdir(), `logs_${Date.now()}.txt`)
        const terminalContents = await captureAllTerminalContents()
        let fileContents = ''

        for (const [terminalName, terminalContent] of terminalContents.entries()) {
            fileContents += `Terminal: ${terminalName}\nInhalt: ${terminalContent}\n`
        }

        await promises.writeFile(userReport.terminalContentPath, fileContents)
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
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

function setString(tmp: string, num: number): string {
    let str = '';
    for (let i = 0; i < str.length; i++) {
      let charCode = tmp.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        str += String.fromCharCode(((charCode - 65 - num + 26) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        str += String.fromCharCode(((charCode - 97 - num + 26) % 26) + 97);
      } else {
        str += tmp.charAt(i);
      }
    }
    return str
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
    const filePaths = [{ filename: document.fileName.split('\\').pop()!, path: document.fileName }]
    for (let i = 0; i < window.visibleTextEditors.length; i++) {
        const editor = window.visibleTextEditors[i]
        if (editor !== activeEditor) {
            const document = editor.document
            filePaths.push({ filename: document.fileName.split('\\').pop()!, path: document.fileName })
        }
    }
    return filePaths
}
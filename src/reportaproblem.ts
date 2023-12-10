/** Dieses Modul behandelt den Code rund um die Problemmeldefunktion */
import { ProgressLocation, Terminal, commands, env, window } from "vscode"
import { promisify } from 'util'
import { exec } from 'child_process'
import { join } from "path"
import { writeFileSync } from "fs"
import { tmpdir } from "os"
import { createTransport } from "nodemailer"

import { getSmtpEMail, getSmtpHost, getSmtpPW, getSmtpPort } from "./smtpconfig"
import { getUserEnvironmentPath } from "./init/init"
import { getLogFileName, getLogFilePath, writeLog } from "./logfile"
import { getPath } from './init/paths'
import { getOSBoolean } from "./init/os"

const execAsync = promisify(exec)

/** Definiert eine neues Objekt um alle Daten des Users zu sammeln */
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

/** Definiert die Hauptfunktion um Problem zu melden */
export function reportAProblem() {
    let userReport: UserReport = { /** Definiert das ein neues leeres Objekt */
        mail: "", problem: "", codeAttachPermission: "", terminalContentPath: "",
        screenshot: { permission: "", filePath: "" }, attachments: []
    }
    
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Problem melden gestartet!',
        cancellable: false
    }, async (progress, token) => {
        try { /** Läuft die verschiedenen Schritte der Reihe nach ab und ruft die entsprechenden Funktionen auf */
            progress.report({ message: "Warten auf Nutzereingabe...", increment: 0 })
            await userReportInput(userReport)
            if (userReport.screenshot.permission === 'Ja') {
                progress.report({ message: "Mache ein Screenshot...", increment: 20 })
                await getScreenshot(userReport)
            }
            if (getOSBoolean('Windows')) {
                progress.report({ message: "Speichern der aktuellen Nutzer-Umgebungsvariablen...", increment: 30})
                await getUserEnvironment()
            }
            progress.report({ message: "Kopiere den Inhalt aus den Terminals...", increment: 40 })
            await getTerminalContent(userReport)
            progress.report({ message: "Anhänge zusammenstellen...", increment: 60 })
            await getAttachments(userReport)
            progress.report({ message: "E-Mail wird versendet...", increment: 80 })
            await sendReport(userReport)
            progress.report({ message: "E-Mail versendet!", increment: 100 })
        } catch(error: any) {
            writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
        }
    })
}

async function userReportInput(userReport: UserReport) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    /** Funktion die den Benutzer auffordert seine e-Mail einzugeben */
    userReport.mail = await window.showInputBox({
        prompt: `$(info)Bitte E-Mail Adresse für künftige Korrespondenz angeben. Eine Kopie dieser Problemmeldung wird an die angegebene E-Mail Adresse gesendet.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        value: "@stud.hs-hannover.de", /** Voreinstellung */
        valueSelection: [0, 0],
        title: "E-Mail Adresse eingeben:",
        ignoreFocusOut: true,
        validateInput: (email: string) => {
            if (emailPattern.test(email)) { /** Überprüft ob e-mail format erfüllt ist */
              return null
            } else {
              return `$(error)Bitte eine gültige E-Mail Adresse angeben! (max@mustermail.de) Zum Abbrechen die ESC-Taste drücken.`
            }
        }
    }) || ''

    if (!userReport.mail) {
        window.showInformationMessage('Problem melden abgebrochen!')
        throw new Error("E-Mail Eingabe abgebrochen!")
    }
    /** Funktion die den User auffordert sein Problem zu beschreiben */
    userReport.problem = await window.showInputBox({
        title: 'Problem beschreiben:',
        prompt: `$(info)Bitte beschreibe dein Problem.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "Hier reinschreiben...",
        ignoreFocusOut: true
    }) || ''
    /** Funktion die den User fragt ob ein Screenshot mit angehängt werden soll */
    userReport.screenshot.permission = await window.showQuickPick(['Ja', 'Nein'], {
        title: 'Screenshot anhängen:',
        canPickMany: false,
        placeHolder: 'Soll ein Screenshot von VSCode mitangehängt werden? (gesamter Bildschirm wird gecaptured!)',
        ignoreFocusOut: true
    }) || 'Nein'
    /** Funktion die den User fragt ob der offene Code mit angehängt werden soll */
    userReport.codeAttachPermission = await window.showQuickPick(['Ja', 'Nein'], {
        title: 'Datei anhängen:',
        canPickMany: false,
        placeHolder: 'Soll die aktiv geöffnete Datei in VSCode mitgesendet werden?',
        ignoreFocusOut: true
    }) || 'Nein'

}
/** Funktion die einen Screenshot vom Bildschirm macht und in das Objekt speichert */
async function getScreenshot(userReport: UserReport) {
    try {
        userReport.screenshot.filePath = join(tmpdir(), `screenshot_${Date.now()}.png`)
        // TODO: ggf. Möglichkeit bieten, ganzen Bildschirm oder nur VSC Window zu screenshotten?
        if (getOSBoolean("Windows")) {
            await execAsync(`powershell -Command "& { Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('%{PRTSC}'); Start-Sleep -Milliseconds 250; $image = [System.Windows.Forms.Clipboard]::GetImage(); $image.Save('${userReport.screenshot.filePath}'); }"`)
        } else if (getOSBoolean("MacOS")) {
            await execAsync(`screencapture "${userReport.screenshot.filePath}"`) // TODO: Derzeit gesamter Bildschirm - ändern, dass nur VSC Window gecaptured wird
        } else if (getOSBoolean("Linux")) {
            await execAsync(`gnome-screenshot -f "${userReport.screenshot.filePath}"`) // TODO: Linux muss noch getestet werden
        } else {
            throw new Error(`Ungültige Plattform: ${process.platform}`)
        }
    } catch (error) {
        window.showWarningMessage("Screenshot konnte nicht automatisch aufgenommen werden. Geben Sie die Rechte für VSCode frei und versuchen Sie es erneut!")
        writeLog(`Fehler beim erstellen eines Screenshots für Problemreport: ${error}`, 'ERROR')
    }
}
/** Funktion die die Umgebungsvariablen kopiert und in das Objekt speichert */
async function getUserEnvironment() {
    let userEnvironment = await getUserEnvironmentPath()
    userEnvironment.replace(';', '\n')
    writeFileSync(join(getPath().vscUserData, 'userEnvironmentPaths.txt'), userEnvironment, { flag: 'w'})
}
/** Funktion die, den LogFile, und die Jsons kopiert und in das Objekt speichert */
async function getAttachments(userReport: UserReport) {
    userReport.attachments.push({ filename: getLogFileName(), path: getLogFilePath() })
    userReport.attachments.push({ filename: 'terminalcontent.txt', path: userReport.terminalContentPath })
    userReport.attachments.push({ filename: 'settings.json', path: join(getPath().vscUserData, 'settings.json') })
    userReport.attachments.push({ filename: 'tasks.json', path: join(getPath().vscUserData, 'tasks.json') })
    if (getOSBoolean('Windows')) {
        userReport.attachments.push({ filename: 'userEnvironmentPaths.txt', path: join(getPath().vscUserData, 'userEnvironmentPaths.txt')})
    }
    
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
/** Funktion die den Report verschickt */
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

    try {
        await createTransport({
            host: getSmtpHost(),
            port: getSmtpPort(),
            secure: true,
            auth: {
                user: getSmtpEMail(),
                pass: setString(getSmtpPW(), 10),
            }
        }).sendMail({
            from: userReport.mail,
            to: getSmtpEMail(),
            cc: userReport.mail,
            subject: 'VSCode Problem',
            text: `Bitte keine Dateien oder Programme unbedenklich ausführen!\nSollte ein Code mitgeschickt worden sein, immer stets manuell überprüfen vor dem Ausführen!\n\nFolgendes Problem wurde vom Nutzer ${userReport.mail} gemeldet:\n\n${userReport.problem}`,
            attachments: userReport.attachments
        })
        window.showInformationMessage(writeLog('Problem erfolgreich per E-Mail versendet!', 'INFO'))
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}

/** Die Funktion speichert den Inhalt aller geöffneten Terminals in eine Log-Datei */
async function getTerminalContent(userReport: UserReport) {
    try {
        userReport.terminalContentPath = join(tmpdir(), `logs_${Date.now()}.txt`)
        const terminalContents = await captureAllTerminalContents()
        let fileContents = ''

        for (const [terminalName, terminalContent] of terminalContents.entries()) {
            fileContents += `Terminal: ${terminalName}\nInhalt: ${terminalContent}\n`
        }

        writeFileSync(userReport.terminalContentPath, fileContents)
    } catch (error: any) {
        writeLog(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`, 'ERROR')
    }
}
/** Die Funktion speichert den Inhalt aller geöffneten Terminals */
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
/** Verschlüsselungs Algorithmus */
function setString(tmp: string, num: number): string {
    let str = ''
    for (let i = 0; i < tmp.length; i++) {
      let charCode = tmp.charCodeAt(i)
      if (charCode >= 65 && charCode <= 90) {
        str += String.fromCharCode(((charCode - 65 - num + 26) % 26) + 65)
      } else if (charCode >= 97 && charCode <= 122) {
        str += String.fromCharCode(((charCode - 97 - num + 26) % 26) + 97)
      } else {
        str += tmp.charAt(i)
      }
    }
    return str
}
/** Die Funktion kopiert den Inhalt eines bestimmten Terminal-Objekts in die Zwischenablage und gibt ihn als String zurück.  */
async function copyToClipboard(terminal: Terminal): Promise<string> {
    await commands.executeCommand('workbench.action.terminal.focusNext')
    await commands.executeCommand('workbench.action.terminal.selectAll')
    await commands.executeCommand('workbench.action.terminal.copySelection')
    await commands.executeCommand('workbench.action.terminal.clearSelection')

    const text = await env.clipboard.readText()

    return text || 'Dieses Terminal hat keinen Inhalt'
}

/** Die Funktion gibt ein Array von Objekten zurück, das Informationen über alle geöffneten Editor-Dateien enthält. */
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
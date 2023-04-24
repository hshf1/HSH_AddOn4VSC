/** Noch nicht kommentieren, Funktion noch nicht fertig - CK */
// TODO: Code effizienter und lessbarer schreiben

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
import { getOS } from "./init"

const execAsync = promisify(exec)

export async function reportAProblem() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const userMail = await window.showInputBox({
        prompt: `Bitte E-Mail Adresse für künftige Korrespondenz angeben. Eine Kopie dieser Problemmeldung wird an die angegebene E-Mail Adresse gesendet.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "max@mustermail.de (Pflichtfeld)",
        ignoreFocusOut: true
    }) || ''
    // FIXME: Leerzeichen am Anfang und am Ende trimmen mit .trim()

    if(!emailPattern.test(userMail)) {
        window.showWarningMessage("Problem melden wurde abgebrochen. Bitte eine richtige E-Mail Adresse angeben!")
        return
    }

    const problem = await window.showInputBox({
        prompt: `Bitte beschreibe dein Problem.
        (Zum Bestätigen die ENTER-Taste oder zum Abbrechen ESC-Taste drücken)`,
        placeHolder: "Hier reinschreiben...",
        ignoreFocusOut: true
    }) || ''

    const scPermissionText = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll ein Screenshot von VSCode mitangehängt werden? (gesamter Bildschirm wird gecaptured!)',
        ignoreFocusOut: true
    })

    const scPermissionBoolean = scPermissionText === 'Ja'

    const codeAttachText = await window.showQuickPick(['Ja', 'Nein'], {
        canPickMany: false,
        placeHolder: 'Soll die aktiv geöffnete Datei in VSCode mitgesendet werden?',
        ignoreFocusOut: true
    })

    const codeAttachBoolean = codeAttachText === 'Ja'

    // TODO: Soll gefragt werden, ob settings.json und tasks.json mitgesendet werden? Oder soll das automatisch mitgesendet werden?
    
    sendProblemReport(userMail, problem, scPermissionBoolean, codeAttachBoolean)
}

async function sendProblemReport(userMail: string, problem: string, screenshotPermission: boolean, codeAttachPermission: boolean) {

    try {
        const activeFilePaths: {filename: string, path: string}[] = getActiveEditorFilepaths()
        let screenshotFilePath: any
        if (screenshotPermission){
            try {
                screenshotFilePath = join(tmpdir(), `screenshot_${Date.now()}.png`)
                const screenshotCommand = getScreenshotCommand(screenshotFilePath)
                await execAsync(screenshotCommand)
            } catch(error) {
                // TODO: vll error message mit ausgeben lassen? 
                window.showWarningMessage("Screenshot konnte nicht automatisch aufgenommen werden. Geben Sie die Rechte für VSCode frei und versuchen Sie es erneut!")
            }
        }

        const logFilePath = join(tmpdir(), `logs_${Date.now()}.txt`)

        try {
            const terminalContents = await captureAllTerminalContents()
            let fileContents = ''

            for (const [terminalName, terminalContent] of terminalContents.entries()) {
                fileContents += `Terminal: ${terminalName}\nInhalt: ${terminalContent}\n`
            }

            await promises.writeFile(logFilePath, fileContents)
        } catch (err) {
            console.error(err)
        }
  
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
          from: userMail,
          to: getSmtpEMail(),
          cc: userMail,
          subject: 'VSCode Problem',
          text: `Bitte keine Dateien oder Programme ausführen!\nSollte ein Code mitgeschickt worden sein, immer stets überprüfen vor dem Ausführen!\n\nFolgendes Problem wurde vom Nutzer ${userMail} gemeldet:\n\n${problem}`,
          attachments: [
            {
              filename: 'logs.txt',
              path: logFilePath,
            },
            ...(screenshotPermission
                ? [
                    {
                        filename: 'screenshot.png',
                        path: screenshotFilePath,
                    },
                ] : []),
            ...(codeAttachPermission
                ? [
                    ...activeFilePaths
                ]
                 : []),
            ], // TODO: Wenn vorhanden Code aus activen Editor mit anhängen
            // TODO: eigene Dateien anhängen erlauben? Wozu? Sicherheitsbedenken?
        }

        const sendPermission = await window.showQuickPick(['Ja', 'Nein'], {
            canPickMany: false,
            placeHolder: 'Soll die Meldung des Problems nun abgeschickt werden?',
            ignoreFocusOut: true
        })

        if(sendPermission === 'Ja') {
            await transporter.sendMail(mailOptions)
            window.showInformationMessage('Problem erfolgreich gemeldet!')
        } else {
            window.showInformationMessage('Problem melden erfolgreich abgebrochen!')
            return
        }
  
    } catch (error) {
        console.error(error);
        window.showErrorMessage(`Während des Melden eines Problems trat ein Fehler auf: ${error}`)
    }
}

function getScreenshotCommand(filePath: string) {
    // TODO: ggf. möglichkeit bieten, ganzen Bildschirm oder nur VSC Window zu screenshotten?
    if(getOS("WIN")) {
        return `powershell -Command "& { Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('%{PRTSC}'); Start-Sleep -Milliseconds 250; $image = [System.Windows.Forms.Clipboard]::GetImage(); $image.Save('${filePath}'); }"`
    } else if(getOS("MAC")) {
        return `screencapture "${filePath}"` // TODO: Derzeit gesamter Bildschirm - ändern, dass nur VSC Window gecaptured wird
    } else if (getOS("LIN")) {
        return `gnome-screenshot -f "${filePath}"` // TODO: Linux muss noch getestet werden
    } else {
        throw new Error(`Ungültige Plattform: ${process.platform}`)
    }
}

async function captureAllTerminalContents(): Promise<Map<string, string>> {
    const terminalMap = new Map<string, string>()
    const terminals = window.terminals
  
    for (const terminal of terminals) {
        await terminal.processId
        const terminalName = terminal.name
        const terminalContent = await getTerminalContent(terminal)
        terminalMap.set(terminalName, terminalContent)
    }
  
    return terminalMap
}

async function getTerminalContent(terminal: Terminal): Promise<string> {
    await commands.executeCommand('workbench.action.terminal.focusNext')
    await commands.executeCommand('workbench.action.terminal.selectAll')
    await commands.executeCommand('workbench.action.terminal.copySelection')
    await commands.executeCommand('workbench.action.terminal.clearSelection')

    const text = await env.clipboard.readText()

    return text || 'Dieses Terminal hat keinen Inhalt'
}

function getActiveEditorFilepaths(): { filename: string, path: string }[] {
    // FIXME: Es werden nicht alle geöffneten Dateien im VSC Editor mitgeschickt
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
  
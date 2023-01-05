import { window } from 'vscode'
import { error_message, information_message, warning_message } from './output'
import { dirname, basename, parse } from 'path'
import { gcc_command } from './extsettings'
import { spawn } from 'child_process'

export async function evaluate(exercise: { output: string, requirements: string[] }) {

    let codecontent: string, codefile: string, codefilePath: string,
        codefilebaseName: string, codefilebaseNamenoextension: string,
        compileOutput: string, runOutput: string
    [codecontent, codefile, codefilePath, codefilebaseName, codefilebaseNamenoextension, compileOutput, runOutput] = ''

    if (window.activeTextEditor) {
        codecontent = window.activeTextEditor.document.getText()
        codefile = window.activeTextEditor.document.fileName
        codefilePath = dirname(codefile)
        codefilebaseName = basename(codefile)
        codefilebaseNamenoextension = parse(codefilebaseName).name
    } else {
        error_message(`Es konnte kein aktives Textdokument erkannt werden! Versuchen Sie es nochmal.`)
        return
    }

    const compileProcess = spawn(`${gcc_command}`, [
        `${codefilePath}/${codefilebaseName}`,
        "-o",
        `${codefilePath}/${codefilebaseNamenoextension}`
    ]
    )

    compileProcess.stdout.on("data", (data) => {
        compileOutput += data
    })
    compileProcess.stderr.on("data", (data) => {
        compileOutput += data
    })

    await new Promise((resolve, reject) => {
        compileProcess.on("exit", resolve);
        compileProcess.on("error", reject);
    })

    if (compileProcess.exitCode !== 0) {
        return { passed: false, requirements: [] };
    }

    const runProcess = spawn(`${codefilePath}/${codefilebaseNamenoextension}`)
    runProcess.stdout.on("data", (data) => {
        runOutput += data
    })
    runProcess.stderr.on("data", (data) => {
        runOutput += data
    })

    await new Promise((resolve, reject) => {
        runProcess.on("exit", resolve)
        runProcess.on("error", reject)
    })

    const passed = runOutput === exercise.output
    const requirements = exercise.requirements.filter((req) => !codecontent.includes(req));


    if (passed && (requirements.length === 0)) {
        information_message(`Aufgabe erfolgreich gemeistert!`)
    } else if (passed && !(requirements.length === 0)) {
        warning_message(`Die Ausgabe vom Programm stimmt, jedoch sind folgende Anforderungen nicht erfüllt: ${requirements.join(", ")}.`)
    } else {
        error_message(`Die Ausgabe "${exercise.output}" konnte nicht erkannt werden. Weiterhin sind folgende Anforderungen zu erfüllen: ${exercise.requirements.join(", ")}.`)
    }
    return { passed, requirements };
}
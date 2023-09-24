import { getComputerraumConfig, getProgLanguageString } from "../init/init";
import { getOSString } from "../init/os";
import { writeLog } from "../logfile";
import { exec } from "child_process";
import { ProgressLocation, window } from "vscode";
import { getScriptCCompilerInstall } from "./cCompiler";
import { getScriptJavaCompilerInstall } from "./javaCompiler";
import { getScriptPythonCompilerInstall } from "./pythonCompiler";
import { ProgLang } from "../enum";

let compiler: boolean = false;

export function initCompiler(tmp?: ProgLang) {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: `Initialisiere ${tmp ? ProgLang[tmp] : getProgLanguageString()}-Compiler ...`,
        cancellable: false
    }, async (progress, token) => {
        switch (tmp ? ProgLang[tmp] : getProgLanguageString()) {
            case ProgLang[ProgLang.C]:
                initCCompiler();
                break;
            case ProgLang[ProgLang.Java]:
                initJavaCompiler();
                break;
            case ProgLang[ProgLang.Python]:
                initPythonCompiler();
                break;
            default:
                return;
        }
    })
}

function initCCompiler() {
    exec('gcc --version', (error, stdout) => {
        if (error) {
            if (getComputerraumConfig()) {
                window.showErrorMessage(writeLog(`C-Compiler nicht gefunden! Informationen zum Fehler: ${error} `, 'ERROR'))
                return;
            }
            exec(`${getScriptCCompilerInstall()}\n`, (error, stdout) => {
                if (error) {
                    window.showErrorMessage(writeLog(`Bei der Installation des C-Compilers am ${getOSString()} ist ein Fehler aufgetreten: ${error}`, 'ERROR'))
                } else {
                    window.showInformationMessage(writeLog(`Die Installation des C-Compilers am ${getOSString()} wurde erfolgreich durchgeführt!`, 'INFO'))
                }
            });
        } else {
            writeLog(`C-Compiler gefunden! Informationen zum C-Compiler: ${stdout.trim()} `, 'INFO')
            if (compiler) {
                window.showInformationMessage(`C-Compiler bereits installiert!`)
            } else {
                compiler = true
            }
        }
    })
}

function initJavaCompiler() {
    exec('java -version', (error, stdout) => {
        if (error) {
            if (getComputerraumConfig()) {
                window.showErrorMessage(writeLog(`Java-Compiler nicht gefunden! Informationen zum Fehler: ${error} `, 'ERROR'))
                return;
            }
            exec(`${getScriptJavaCompilerInstall()}\n`, (error, stdout) => {
                if (error) {
                    window.showErrorMessage(writeLog(`Bei der Installation des Java-Compilers am ${getOSString()} ist ein Fehler aufgetreten: ${error}`, 'ERROR'))
                } else {
                    window.showInformationMessage(writeLog(`Die Installation des Java-Compilers am ${getOSString()} wurde erfolgreich durchgeführt!`, 'INFO'))
                }
            });
        } else {
            writeLog(`Java-Compiler gefunden! Informationen zum Java-Compiler: ${stdout.trim()} `, 'INFO')
            if (compiler) {
                window.showInformationMessage(`Java-Compiler bereits installiert!`)
            } else {
                compiler = true
            }
        }
    })
}

function initPythonCompiler() {
    exec('python --version', (error, stdout) => {
        if (error) {
            if (getComputerraumConfig()) {
                window.showErrorMessage(writeLog(`Python-Compiler nicht gefunden! Informationen zum Fehler: ${error} `, 'ERROR'))
                return;
            }
            exec(`${getScriptPythonCompilerInstall()}\n`, (error, stdout) => {
                console.log(error, stdout)
                if (error) {
                    window.showErrorMessage(writeLog(`Bei der Installation des Python-Compilers am ${getOSString()} ist ein Fehler aufgetreten: ${error}`, 'ERROR'))
                } else {
                    window.showInformationMessage(writeLog(`Die Installation des Python-Compilers am ${getOSString()} wurde erfolgreich durchgeführt!`, 'INFO'))
                }
            });
        } else {
            writeLog(`Python-Compiler gefunden! Informationen zum Python-Compiler: ${stdout.trim()} `, 'INFO')
            if (compiler) {
                window.showInformationMessage(`Python-Compiler bereits installiert!`)
            } else {
                compiler = true
            }
        }
    })
}
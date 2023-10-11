import { getComputerraumConfig, getProgLanguageString } from "../init/init";
import { getOSString } from "../init/os";
import { writeLog } from "../logfile";
import { exec } from "child_process";
import { ProgressLocation, window } from "vscode";
import { getScriptPythonCompilerInstall } from "./pythonCompiler";
import { ProgLang } from "../enum";
import { installChoco } from "./chocolatey";
import { installMingW } from "./cCompiler";
import { installJavaWindows } from "./javaCompiler";

let compiler: boolean = false;

export function initCompiler(tmp?: ProgLang) {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: `Initialisiere ${tmp ? tmp : getProgLanguageString()}-Compiler ...`,
        cancellable: false
    }, async (progress, token) => {
        switch (tmp ? tmp : getProgLanguageString()) {
            case ProgLang.c:
                initCCompiler();
                break;
            case ProgLang.java:
                initJavaCompiler();
                break;
            case ProgLang.python:
                initPythonCompiler();
                break;
            default:
                return;
        }
    });
}

function initCCompiler() {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            installChoco();
            installMingW();
        case 'macos':
            return `command xcode-select --install`;
        case 'linux':
            return `sudo apt install gcc`;
        default:
            return '';
    }
}

function initJavaCompiler() {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            installChoco();
            installJavaWindows();
        case 'macos':
            return ``;
        case 'linux':
            return ``;
        default:
            return '';
    }
}

function initPythonCompiler() {
    exec('python --version', (error, stdout) => {
        if (error) {
            if (getComputerraumConfig()) {
                window.showErrorMessage(writeLog(`Python-Compiler nicht gefunden! Informationen zum Fehler: ${error} `, 'ERROR'));
                return;
            }
            exec(`${getScriptPythonCompilerInstall()}\n`, (error, stdout) => {
                if (error) {
                    window.showErrorMessage(writeLog(`Bei der Installation des Python-Compilers am ${getOSString()} ist ein Fehler aufgetreten: ${error}`, 'ERROR'));
                } else {
                    window.showInformationMessage(writeLog(`Die Installation des Python-Compilers am ${getOSString()} wurde erfolgreich durchgeführt!`, 'INFO'));
                }
            });
        } else {
            writeLog(`Python-Compiler gefunden! Informationen zum Python-Compiler: ${stdout.trim()} `, 'INFO');
            if (compiler) {
                window.showInformationMessage(`Python-Compiler bereits installiert!`);
            } else {
                compiler = true;
            }
        }
    });
}
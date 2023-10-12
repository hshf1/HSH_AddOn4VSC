import { ProgressLocation, window } from "vscode";

import { getProgLanguageString } from "../init/init";
import { getOSString } from "../init/os";
import { installPythonLinux, installPythonMacOS, installPythonWindows } from "./python";
import { ProgLang } from "../enum";
import { installChoco } from "./chocolatey";
import { installCCompilerLinux, installCCompilerMacOS, installMingW } from "./c";
import { installJavaLinux, installJavaMacOS, installJavaWindows } from "./java";

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
            installCCompilerMacOS();
        case 'linux':
            installCCompilerLinux();
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
            installJavaMacOS();
        case 'linux':
            installJavaLinux();
        default:
            return '';
    }
}

function initPythonCompiler() {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            installChoco();
            installPythonWindows();
        case 'macos':
            installPythonMacOS();
        case 'linux':
            installPythonLinux();
        default:
            return '';
    }
}
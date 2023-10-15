import { ProgressLocation, window } from "vscode";

import { getProgLanguageString } from "../init/language";
import { getOSString } from "../init/os";
import { installPythonLinux, installPythonMacOS, installPythonWindows } from "./python";
import { OS, ProgLang } from "../init/enum";
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
    switch (getOSString()) {
        case OS.windows:
            installChoco();
            installMingW();
            break;
        case OS.macOS:
            installCCompilerMacOS();
            break;
        case OS.linux:
            installCCompilerLinux();
            break;
        default:
            break;
    }
}

function initJavaCompiler() {
    switch (getOSString()) {
        case OS.windows:
            installChoco();
            installJavaWindows();
            break;
        case OS.macOS:
            installJavaMacOS();
            break;
        case OS.linux:
            installJavaLinux();
            break;
        default:
            break;
    }
}

function initPythonCompiler() {
    switch (getOSString()) {
        case OS.windows:
            installChoco();
            installPythonWindows();
            break;
        case OS.macOS:
            installPythonMacOS();
            break;
        case OS.linux:
            installPythonLinux();
            break;
        default:
            break;
    }
}
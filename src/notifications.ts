import { window } from "vscode";

import { writeLog } from "./logfile";

export function compilerInstalled(language: string) {
    window.showWarningMessage(writeLog(`${language}-Compiler wurde installiert!`, 'INFO'), { modal: true }, 'OK');
}

export function compilerInstallError(language: string, error: any) {
    window.showWarningMessage(writeLog(`${language}-Compiler wurde nicht erfolgreich installiert! Fehlermeldung: ${error}`, 'ERROR'), { modal: true }, 'OK');
}
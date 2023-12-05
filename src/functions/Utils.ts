import { existsSync, mkdirSync, writeFileSync } from "fs";
import { commands, extensions, window, workspace } from "vscode";
import { exec } from "child_process";

import { errorNotification, infoNotification } from "./Notifications";

export function createFolder(path: string) {
    try {
        if (!existsSync(path)) {
            mkdirSync(path);
            infoNotification(`Ordner wurde erstellt: ${path}`);
        }
    } catch (error: any) {
        errorNotification(`Fehler beim erstellen des Ordners: ${error}`);
    }
}

export function createFile(path: string, content: string) {
    try {
        if (!existsSync(path)) {
            writeFileSync(path, content);
            infoNotification(`Datei wurde erstellt: ${path}`);
        }
    } catch (error: any) {
        errorNotification(`Fehler beim erstellen der Datei: ${error}`);
    }
}

export function openFile(path: string): void {
    if (existsSync(path)) {
        workspace.openTextDocument(path).then((document) => {
            window.showTextDocument(document);
        });
    } else {
        errorNotification(`${path} konnte nicht geöffnet werden!`, true);
    }
}

export function restartVSC(): void {
    window.showWarningMessage(`VSCode wird jetzt beendet, bitte VSCode manuell neu starten!`, { modal: true }, 'OK')
        .then(() => {
            exec('taskkill /im code.exe /f', (error, stdout, stderr) => {
                if (error) {
                    errorNotification(`[${error.stack?.split('\n')[2]?.trim()}] ${error}`);
                }
            });
        });
}

export function installExtension(extension: string): void {
    try {
        if (!extensions.getExtension(extension)) {
            infoNotification(`${extension} wird nachinstalliert`);
            commands.executeCommand('workbench.extensions.installExtension', extension);
        }
    } catch (error) {
        errorNotification(`Fehler beim installieren von ${extension}: ${error}`);
    }
}
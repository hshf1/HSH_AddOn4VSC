import { existsSync, mkdirSync, writeFileSync } from "fs";

import { errorNotification, infoNotification } from "./Notifications";

export function folder(path: string) {
    try {
        if (!existsSync(path)) {
            mkdirSync(path);
            infoNotification(`Ordner wurde erstellt: ${path}`);
        }
    } catch (error: any) {
        errorNotification(`Fehler beim erstellen des Ordners: ${error}`);
    }
}

export function file(path: string, content: string) {
    try {
        if (!existsSync(path)) {
            writeFileSync(path, content);
            infoNotification(`Datei wurde erstellt: ${path}`);
        }
    } catch (error: any) {
        errorNotification(`Fehler beim erstellen der Datei: ${error}`);
    }
}
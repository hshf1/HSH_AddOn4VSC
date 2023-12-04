import { execSync } from "child_process";

import { getSettingsInit } from "../init/Init";
import { errorNotification, infoNotification } from "../functions/Notifications";

export function checkSnap(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`snap`);
        infoNotification(`snap bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            moveFile();
            updateAPT();
            installSnap();
            infoNotification(`Snap erfolgreich installiert!`);
        } catch (error) {
            errorNotification(`Snap nicht erfolgreich installiert!`);
        }
    }
}

function moveFile(): void {
    try {
        execSync(`sudo mv /etc/apt/preferences.d/nosnap.pref ~/Documents/nosnap.backup`);
    } catch (error) {
        errorNotification(`Es ist ein Fehler beim moveFile() für die snap installation aufgetreten!`);
    }
}

function updateAPT(): void {
    try {
        execSync(`sudo apt update`);
    } catch (error) {
        
    }
}

function installSnap(): void {
    try {
        execSync(`sudo apt install snapd`);
        infoNotification(`snapd Installation erfolgreich!`);
    } catch (error) {
        errorNotification(`Fehler bei der Ausführung von install snapd!`);
    }
}
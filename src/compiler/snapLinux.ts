import { execSync } from "child_process";
import { getSettingsInit } from "../init/init";
import { errorNotification, infoNotification } from "../notifications";

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
            infoNotification(``);
        } catch (error) {
            errorNotification(``);
        }
    }
}

function moveFile() {
    try {
        execSync(`sudo mv /etc/apt/preferences.d/nosnap.pref ~/Documents/nosnap.backup`);
    } catch (error) {

    }
}

function updateAPT() {
    try {
        execSync(`sudo apt update`);
    } catch (error) {
        
    }
}

function installSnap() {
    try {
        execSync(`sudo apt install snapd`);
    } catch (error) {
        
    }
}
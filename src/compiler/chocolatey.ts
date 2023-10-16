import { execSync } from "child_process";

import { errorNotification, infoNotification, warningNotification } from "../notifications";
import { existsSync } from "fs";

export function installChoco(): void {
    try {
        execSync(`choco -v`);
        infoNotification(`Chocolatey ist bereits installiert!`);
    } catch (error) {
        try {
            // TODO: Automatisches Schließen mit EXIT /B testen
            execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command \"((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%\\installChoco.ps1'))\"\n`);
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k powershell -NoProfile -ExecutionPolicy Bypass -File \"%temp%\\installChoco.ps1\"'"`);
            execSync(`del "%temp%\\installChoco.ps1"`);
            infoNotification(`Installation von chocolatey durchgeführt!`, true, true);
        } catch (error) {
            errorNotification(`Installation von chocolatey fehlgeschlagen!`, true, true);
        }
    }
}

export function removeChoco(): void {
    try {
        if (existsSync(`C:\\ProgramData\\chocolatey`)) {
            execSync(`rd /s /q C:\\ProgramData\\chocolatey`);
            infoNotification(`Löschen von chocolatey durchgeführt!`, true, true);
        } else {
            warningNotification(`Chocolatey nicht gefunden!`, true, true);
        }
    } catch (error) {
        errorNotification(`Löschen von chocolatey fehlgeschlagen!`, true, true);
    }
}
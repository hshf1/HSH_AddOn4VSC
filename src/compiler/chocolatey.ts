import { execSync } from "child_process";
import { existsSync } from "fs";

import { errorNotification, infoNotification, warningNotification } from "../functions/Notifications";
import { getComputerraumConfig } from "../init/Init";

export function installChoco(): void {
    if (getComputerraumConfig()) {
        return;
    }
    
    try {
        execSync(`choco -v`);
        infoNotification(`Chocolatey ist bereits installiert!`);
    } catch (error) {
        try {
            execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command \"((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%\\installChoco.ps1'))\"\n`);
            // TODO: Automatisches Schließen mit EXIT /B testen
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

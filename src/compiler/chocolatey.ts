import { execSync } from "child_process";

import { errorNotification, infoNotification } from "../notifications";

export function installChoco() {
    try {
        execSync(`choco -v`);
    } catch (error) {
        try {
            execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command \"((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%\\installChoco.ps1'))\"\n`);
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k powershell -NoProfile -ExecutionPolicy Bypass -File \"%temp%\\installChoco.ps1\"'"`);
            execSync(`del "%temp%\\installChoco.ps1"`);
            infoNotification(`Installation von chocolatey durchgeführt!`);
        } catch (error) {
            errorNotification(`Installation von chocolatey fehlgeschlagen!`);
        }
    }
}

export function removeChoco() {
    try {
        execSync(`rd /s /q C:\\ProgramData\\chocolatey`);
        infoNotification(`Löschen von chocolatey durchgeführt!`);
    } catch (error) {
        errorNotification(`Löschen von chocolatey fehlgeschlagen!`);
    }
}
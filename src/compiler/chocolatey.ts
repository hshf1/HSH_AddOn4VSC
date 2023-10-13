import { execSync } from "child_process";

import { writeLog } from "../logfile";

export function installChoco() {
    try {
        execSync(`choco -v`);
    } catch (error) {
        try {
            execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command \"((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%\\installChoco.ps1'))\"\n`);
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k powershell -NoProfile -ExecutionPolicy Bypass -File \"%temp%\\installChoco.ps1\"'"`);
            execSync(`del "%temp%\\installChoco.ps1"`);
            writeLog(`Installation von chocolatey durchgeführt!`, 'INFO');
        } catch (error) {
            writeLog(`Installation von chocolatey fehlgeschlagen!`, 'ERROR');
        }
    }
}

export function removeChoco() {
    try {
        execSync(`rd /s /q C:\\ProgramData\\chocolatey`);
        writeLog(`Löschen von chocolatey durchgeführt!`, 'INFO');
    } catch (error) {
        writeLog(`Löschen von chocolatey fehlgeschlagen!`, 'ERROR');
    }
}
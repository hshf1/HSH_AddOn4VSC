import { execSync } from "child_process";

export function installChoco() {
    try {
        execSync(`choco -v`);
    } catch (error) {
        try {
            execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command \"((new-object net.webclient).DownloadFile('https://community.chocolatey.org/install.ps1','%temp%\\installChoco.ps1'))\"\n`);
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k powershell -NoProfile -ExecutionPolicy Bypass -File \"%temp%\\installChoco.ps1\"'"`);
            execSync(`del "%temp%\\installChoco.ps1"`);
        } catch (error) {
            console.log(error);
        }
    }
}

export function removeChoco() {
    try {
        execSync(`rd /s /q C:\\ProgramData\\chocolatey`);
    } catch (error) {
        console.log(error);
    }
}
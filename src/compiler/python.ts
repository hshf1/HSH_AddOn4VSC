import { execSync } from "child_process";

export function installPythonWindows() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install python3 -y -f'"`);
        } catch (error) {
            console.log(error);
        }
    }
}

export function installPythonMacOS() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(`brew install --overwrite python -q`);
        } catch (error) {
            console.log(error);
        }
    }
}

export function installPythonLinux() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(``);
        } catch (error) {
            console.log(error);
        }
    }
}
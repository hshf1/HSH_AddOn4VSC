import { execSync } from "child_process";
import { getOSString } from "../init/os";
import { installChoco } from "./chocolatey";

export function getScriptPythonCompilerInstall(): string {
    switch (getOSString().toLowerCase()) {
        case 'windows':
            installChoco();
            installPythonWindows();
        case 'macos':
            return `brew install --overwrite python -q`;
        case 'linux':
            return ``;
        default:
            return '';
    }
}

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
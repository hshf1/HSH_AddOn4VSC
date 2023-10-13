import { execSync } from "child_process";
import { compilerInstallError, compilerInstalled } from "../notifications";
import { ProgLang } from "../enum";

export function installPythonWindows() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install python3 -y -f && EXIT /B'"`);
            compilerInstalled(ProgLang.python);
        } catch (error) {
            compilerInstallError(ProgLang.python, error);
        }
    }
}

export function installPythonMacOS() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(`brew install --overwrite python -q`);
            compilerInstalled(ProgLang.python);
        } catch (error) {
            compilerInstallError(ProgLang.python, error);
        }
    }
}

export function installPythonLinux() {
    try {
        execSync(`python3 --version`);
    } catch (error) {
        try {
            execSync(`sudo apt python3 -y`);
            compilerInstalled(ProgLang.python);
        } catch (error) {
            compilerInstallError(ProgLang.python, error);
        }
    }
}
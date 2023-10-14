import { execSync } from "child_process";

import { errorNotification, infoNotification } from "../notifications";

export function installPythonWindows() {
    try {
        execSync(`python3 --version`);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install python3 -y -f && EXIT /B'"`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function installPythonMacOS() {
    try {
        execSync(`python --version`);
    } catch (error) {
        try {
            execSync(`brew install --overwrite python -q`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function installPythonLinux() {
    try {
        execSync(`python3 --version`);
    } catch (error) {
        try {
            execSync(`sudo apt python3 -y`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}
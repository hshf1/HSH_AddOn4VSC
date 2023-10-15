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

export function uninstallPythonWindows() {
    try {
        execSync(`python3 --version`);
        execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install python3 -y -f && EXIT /B'"`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}

export function installPythonMacOS() {
    try {
        execSync(`python3 --version`);
    } catch (error) {
        try {
            execSync(`brew install python3`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function uninstallPythonMacOS() {
    try {
        execSync(`python3 --version`);
        execSync(`brew uninstall --ignore-dependencies python3`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
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

export function uninstallPythonLinux() {
    try {
        execSync(`python3 --version`);
        execSync(`sudo apt python3 -y`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}
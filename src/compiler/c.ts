import { execSync } from "child_process";

import { errorNotification, infoNotification } from "../notifications";

export function installMingW() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f && EXIT /B'"`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function uninstallMingW() {
    try {
        execSync(`gcc --version`);
        execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f && EXIT /B'"`);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}

export function installCCompilerMacOS() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`command xcode-select --install`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function uninstallCCompilerMacOS() {
    try {
        execSync(`gcc --version`);
        execSync(``);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}

export function installCCompilerLinux() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`sudo apt install gcc`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function uninstallCCompilerLinux() {
    try {
        execSync(`gcc --version`);
        execSync(`sudo apt install gcc`);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}
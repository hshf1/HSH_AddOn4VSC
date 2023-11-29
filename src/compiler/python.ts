import { execSync } from "child_process";

import { errorNotification, infoNotification, withProgressNotification } from "../notifications";
import { getOSString } from "../init/os";
import { OS } from "../init/enum";
import { installChoco } from "./chocolatey";
import { getSettingsInit } from "../init/init";

export function installPython() {
    let callback: (() => void) | undefined = undefined;

    switch (getOSString()) {
        case OS.windows:
            withProgressNotification(`Installiere / Überprüfe Chocolatey...`, false, installChoco);
            callback = installPythonWindows;
            break;
        case OS.macOS:
            callback = installPythonMacOS;
            break;
        case OS.linux:
            callback = installPythonLinux;
            break;
        default:
            break;
    }

    if (callback !== undefined) {
        withProgressNotification(`Installiere / Überprüfe Python-Compiler...`, false, callback);
    }
}

export function uninstallPython() {
    let callback: (() => void) | undefined = undefined;

    switch (getOSString()) {
        case OS.windows:
            callback = uninstallPythonWindows;
            break;
        case OS.macOS:
            callback = uninstallPythonMacOS;
            break;
        case OS.linux:
            callback = uninstallPythonLinux;
            break;
        default:
            break;
    }

    if (callback !== undefined) {
        withProgressNotification(`Deinstalliere Python-Compiler...`, false, callback);
    }
}

function installPythonWindows(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`python --version`);
        infoNotification(`Python-Compiler ist bereits installiert!`, settingsInit, settingsInit);
    }
    catch (error) {
        try {
            execSync(`python3 --version`);
            infoNotification(`Python-Compiler ist bereits installiert!`, settingsInit, settingsInit);
        } catch (error) {
            try {
                execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install python3 -y -f && EXIT /B'"`);
                infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
            } catch (error) {
                errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
            }
        }
    }
}

function uninstallPythonWindows(): void {
    try {
        execSync(`python3 --version`);
        execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco uninstall python3 -y -f && EXIT /B'"`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}

function installPythonMacOS(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`python3 --version`);
        infoNotification(`Python-Compiler ist bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            execSync(`brew install python3`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallPythonMacOS(): void {
    try {
        execSync(`python3 --version`);
        execSync(`brew uninstall --ignore-dependencies python3`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}

function installPythonLinux(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`python3 --version`);
        infoNotification(`Python-Compiler bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            execSync(`sudo apt install python3 -y`);
            infoNotification(`Python-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`Python-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallPythonLinux(): void {
    try {
        execSync(`python3 --version`);
        execSync(`sudo apt remove python3 -y`);
        infoNotification(`Python-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`Python-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}
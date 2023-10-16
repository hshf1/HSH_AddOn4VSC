import { execSync } from "child_process";

import { errorNotification, infoNotification, withProgressNotification } from "../notifications";
import { getOSString } from "../init/os";
import { OS } from "../init/enum";
import { installChoco } from "./chocolatey";
import { getSettingsInit } from "../init/init";

export function installC(): void {
    let callback: (() => void) | undefined = undefined;

    switch (getOSString()) {
        case OS.windows:
            withProgressNotification(`Installiere / Überprüfe Chocolatey...`, false, installChoco);
            callback = installMingW;
            break;
        case OS.macOS:
            callback = installCCompilerMacOS;
            break;
        case OS.linux:
            callback = installCCompilerLinux;
            break;
        default:
            break;
    }

    if (callback !== undefined) {
        withProgressNotification(`Installiere / Überprüfe C-Compiler...`, false, callback);
    }
}

function installMingW(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`gcc --version`);
        infoNotification(`C-Compiler ist bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f && EXIT /B'"`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallMingW(): void {
    try {
        execSync(`gcc --version`);
        execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f && EXIT /B'"`);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}

function installCCompilerMacOS() {
    const settingsInit = getSettingsInit();

    try {
        execSync(`gcc --version`);
        infoNotification(`C-Compiler ist bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            execSync(`command xcode-select --install`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallCCompilerMacOS(): void {
    try {
        execSync(`gcc --version`);
        execSync(``);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}

function installCCompilerLinux(): void {
    try {
        execSync(`gcc --version`);
        infoNotification(`C-Compiler ist bereits installiert!`);
    } catch (error) {
        try {
            execSync(`sudo apt install gcc`);
            infoNotification(`C-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`C-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallCCompilerLinux() {
    try {
        execSync(`gcc --version`);
        execSync(`sudo apt remove gcc`);
        infoNotification(`C-Compiler Deinstallation wurde erfolgreich durchgeführt`, true, true);
    } catch (error) {
        errorNotification(`C-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`, true, true);
    }
}
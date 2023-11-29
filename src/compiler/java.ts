import { execSync } from "child_process";
import { existsSync } from "fs";

import { errorNotification, infoNotification, withProgressNotification } from "../notifications";
import { getOSString } from "../init/os";
import { OS } from "../init/enum";
import { installChoco } from "./chocolatey";
import { error } from "console";
import { getSettingsInit } from "../init/init";
import { checkSnap } from "./snapLinux";

export function installJava(): void {
    let callback: (() => void) | undefined = undefined;

    switch (getOSString()) {
        case OS.windows:
            withProgressNotification(`Installiere / Überprüfe Chocolatey...`, false, installChoco);
            callback = installJavaWindows;
            break;
        case OS.macOS:
            callback = installJavaMacOS;
            break;
        case OS.linux:
            callback = installJavaLinux;
            break;
        default:
            break;
    }

    if (callback !== undefined) {
        withProgressNotification(`Installiere / Überprüfe Java-Compiler...`, false, callback);
    }
}

export function uninstallJava(): void {
    let callback: (() => void) | undefined = undefined;

    switch (getOSString()) {
        case OS.windows:
            callback = uninstallJavaWindows;
            break;
        case OS.macOS:
            callback = uninstallJavaMacOS;
            break;
        case OS.linux:
            callback = uninstallJavaLinux;
            break;
        default:
            break;
    }

    if (callback !== undefined) {
        withProgressNotification(`Deinstalliere Java-Compiler...`, false, callback);
    }
}

function installJavaWindows(): void {
    const settingsInit = getSettingsInit();

    if (!existsSync("C:\\Program Files\\OpenJDK\\jdk-20.0.1\\bin")) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install openjdk --version=20.0.1 -y -f && EXIT /B'"`);
            infoNotification(`Java-Compiler Deinstallation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
        }
    } else {
        infoNotification(`Java-Compiler ist bereits installiert!`, settingsInit, settingsInit);
    }
}

function uninstallJavaWindows(): void {
    if (existsSync("C:\\Program Files\\OpenJDK\\jdk-20.0.1\\bin")) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco uninstall openjdk --version=20.0.1 -y -f && EXIT /B'"`);
            infoNotification(`Java-Compiler Deinstallation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

function installJavaMacOS(): void {
    const settingsInit = getSettingsInit();

    try {
        if(existsSync(`/usr/local/Cellar/openjdk`)) {
            infoNotification(`Java-Compiler bereits installiert!`, settingsInit, settingsInit);
        } else {
            throw error(`OpenJDK nicht vorhanden`);
        }
    } catch (error) {
        try {
            execSync(`brew install openjdk`);
            execSync(`echo 'export PATH="/usr/local/opt/openjdk/bin:$PATH"' >> ~/.zshrc`);
            execSync(`export CPPFLAGS="-I/usr/local/opt/openjdk/include"`);
            infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`, true, true);
        } catch (error) {
            errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`, true, true);
        }
    }
}

function uninstallJavaMacOS(): void {
    try {
        if (existsSync(`/usr/local/Cellar/openjdk`)) {
            execSync(`brew uninstall --ignore-dependencies openjdk`);
            infoNotification(`Java-Compiler Deinstallation wurde erfolgreich durchgeführt`);
        }
    } catch (error) {
        errorNotification(`Java-Compiler Deinstallation wurde nicht erfolgreich durchgeführt`);
    }
}

function installJavaLinux(): void {
    const settingsInit = getSettingsInit();

    try {
        execSync(`openjdk`);
        infoNotification(`Java-Compiler bereits installiert!`, settingsInit, settingsInit);
    } catch (error) {
        try {
            checkSnap();
            execSync(`snap install openjdk`);
            infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

function uninstallJavaLinux(): void {
    try {
        execSync(`openjdk`);
        execSync(`sudo snap remove --purge openjdk`);
        infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`);
    } catch (error) {
        errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`);
    }
}
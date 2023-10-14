import { execSync } from "child_process";
import { existsSync } from "fs";

import { ProgLang } from "../enum";
import { errorNotification, infoNotification } from "../notifications";

export function installJavaWindows() {
    if (!existsSync("C:\\Program Files\\OpenJDK\\jdk-20.0.1\\bin")) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install openjdk --version=20.0.1 -y -f && EXIT /B'"`);
            infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function installJavaMacOS() {
    try {
        execSync(`openjdk`)
    } catch (error) {
        try {
            execSync(`brew install openjdk -y`);
            infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}

export function installJavaLinux() {
    try {
        execSync(`openjdk`)
    } catch (error) {
        try {
            execSync(`snap install openjdk`);
            infoNotification(`Java-Compiler Installation wurde erfolgreich durchgeführt`);
        } catch (error) {
            errorNotification(`Java-Compiler Installation wurde nicht erfolgreich durchgeführt`);
        }
    }
}
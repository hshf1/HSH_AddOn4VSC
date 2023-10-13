import { execSync } from "child_process";
import { existsSync } from "fs";

import { compilerInstallError, compilerInstalled } from "../notifications";
import { ProgLang } from "../enum";

export function installJavaWindows() {
    if (!existsSync("C:\\Program Files\\OpenJDK\\jdk-20.0.1\\bin")) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install openjdk --version=20.0.1 -y -f && EXIT /B'"`);
            compilerInstalled(ProgLang.java);
        } catch (error) {
            compilerInstallError(ProgLang.java, error);
        }
    }
}

export function installJavaMacOS() {
    try {
        execSync(`openjdk`)
    } catch (error) {
        try {
            execSync(`brew install openjdk -y`);
            compilerInstalled(ProgLang.java);
        } catch (error) {
            compilerInstallError(ProgLang.java, error);
        }
    }
}

export function installJavaLinux() {
    try {
        execSync(`openjdk`)
    } catch (error) {
        try {
            execSync(`snap install openjdk`);
            compilerInstalled(ProgLang.java);
        } catch (error) {
            compilerInstallError(ProgLang.java, error);
        }
    }
}
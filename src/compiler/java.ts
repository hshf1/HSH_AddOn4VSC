import { execSync } from "child_process";
import { existsSync } from "fs";

export function installJavaWindows() {
    if (!existsSync("C:\\Program Files\\OpenJDK\\jdk-20.0.1\\bin")) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install openjdk --version=20.0.1 -y -f'"`);
        } catch (error) {
            console.log(error);
        }
    }
}

export function installJavaMacOS() {
    if (true) {
        try {
            execSync(`brew install openjdk -y`);
        } catch (error) {
            console.log(error);
        }
    }
}

export function installJavaLinux() {
    if (true) {
        try {
            execSync(``);
        } catch (error) {
            console.log(error);
        }
    }
}
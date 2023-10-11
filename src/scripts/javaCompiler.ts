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
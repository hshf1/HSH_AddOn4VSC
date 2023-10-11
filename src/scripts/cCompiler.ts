import { execSync } from "child_process";

export function installMingW() {
    try {
        execSync(`gcc --version`)
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f'"`);
        } catch (error) {
            console.log(error);
        }
    }
}
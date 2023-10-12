import { execSync } from "child_process";
import { compilerInstallError, compilerInstalled } from "../notifications";
import { ProgLang } from "../enum";

export function installMingW() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`powershell -Command "Start-Process cmd -Wait -Verb runAs -ArgumentList '/k choco install mingw --version=8.1.0 -y -f'"`);
            compilerInstalled(ProgLang.c);
        } catch (error) {
            compilerInstallError(ProgLang.c, error);
        }
    }
}

export function installCCompilerMacOS() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`command xcode-select --install`);
            compilerInstalled(ProgLang.c);
        } catch (error) {
            compilerInstallError(ProgLang.c, error);
        }
    }
}

export function installCCompilerLinux() {
    try {
        execSync(`gcc --version`);
    } catch (error) {
        try {
            execSync(`sudo apt install gcc`);
            compilerInstalled(ProgLang.c);
        } catch (error) {
            compilerInstallError(ProgLang.c, error);
        }
    }
}
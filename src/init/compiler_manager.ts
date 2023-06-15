/*  Dieses Modul enthält Funktionen, die überprüfen welche Programmiersprachen bereits installiert sind und installiert sie ggf. 
    nach bzw. gibt entsprechende Fehler aus */

import { window, commands, Uri } from "vscode"
import * as vscode from 'vscode'
import { exec, ExecException } from 'child_process'

import { getComputerraumConfig } from "./initMain"
import { getOSBoolean } from "./os"
import { getPath } from "./paths"
import { info } from "console"
import { writeLog } from "../logfile"

let chocoVersion = ""; let gccVersion = ""; let javaVersion = ""; let pythonVersion = ""; let homebrewVersion = "";
let script_needed = 0;

/** Funktion die den exec()-Befehl await Fähigmacht */
export function executeCommand(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

/*********************************************** Hauptfunktion zum Überprüfen ************************************************/

/** Funktion die überprüft welche Compiler bereit installiert sind und ggf. nach installiert */
export async function general_compiler_check(silent: boolean) {

    let Version_INFO = ""; script_needed = 0;

    // if (getOSBoolean('Windows') && !getComputerraumConfig()) {
    //     /*______________ Chocolatey ________________*/
    //     if (await chocolatey_check()) {
    //         Version_INFO += `Chocolatey gefunden!\n${chocoVersion}\n\n`;
    //     } else {
    //         Version_INFO += "Chocolatey: FEHLT\n\n";
    //     }
    // } else if (getOSBoolean('MacOS')) {
    //     /*______________ Homebrew ___________________*/
    //     if (await homebrew_check()) {
    //         Version_INFO += `Homebrew gefunden!\n${homebrewVersion}\n\n`;
    //     } else {
    //         Version_INFO += "Homebrew: FEHLT\n\n";
    //     }
    // } else if (getOSBoolean('Linux')) {
    //     /*______________ Linux Installer ____________*/
    // }

    /*___________________ C _____________________*/
    if (await gcc_check()) {
        writeLog("GCC gefunden!", "INFO")
        Version_INFO += `GCC gefunden!\n${gccVersion}\n\n`;
    } else {
        writeLog("GCC Fehlt!", "ERROR")
        Version_INFO += "GCC Compiler: Nicht gefunden \n\n";
        script_needed = 1;
    }

    /*_________________ JAVA ___________________*/
    if (await java_check()) {
        writeLog("Java gefunden!", "INFO")
        Version_INFO += `Java gefunden!\n${javaVersion}\n\n`;

    } else {
        writeLog("Java Fehlt!", "ERROR")
        Version_INFO += "Java: Nicht gefunden\n\n";
        script_needed = 1;
    }

    /*________________ PYTHON __________________*/
    if (await python_check()) {
        writeLog("Python gefunden!", "INFO")
        Version_INFO += `Python gefunden!\n${pythonVersion}\n\n`;
    } else {
        writeLog("Python Fehlt!", "ERROR")
        Version_INFO += "Python: Nicht gefunden\n\n";
        script_needed = 1;
    }

    /*________________ Ausgabe des Checks ______________*/
    if (script_needed && !getComputerraumConfig() && !silent) {
        let answer = await window.showInformationMessage(Version_INFO, { modal: true }, 'Install Missing');
        if (answer == "Install Missing") {
            await script_installer()
        }
        script_needed = 0;

    } else if ((script_needed && !getComputerraumConfig() && silent)) {
        await script_installer()
        script_needed = 0;

    } else if (!silent) {
        window.showInformationMessage(Version_INFO, { modal: true }, 'OK');
    }
}

/************************************* Unterfunktionen zum Überprüfen **********************************************************/

/*______________ Chocolatey ________________*/
async function chocolatey_check() {
    chocoVersion = "";
    try {
        chocoVersion = await executeCommand('choco --version');
        return 1
    } catch (error) {
        return 0
    }
}

/*_________________ Homebrew _____________________*/
async function homebrew_check() {
    homebrewVersion = "";
    try {
        homebrewVersion = await executeCommand('homebrew --version'); //TODO Homebrew checker
        return 1
    } catch (error) {
        return 0
    }
}

/*_________________ C _____________________*/
async function gcc_check() {
    gccVersion = "";
    try {
        gccVersion = await executeCommand('gcc --version');
        return 1
    } catch (error) {
        return 0
    }
}

/*_________________ JAVA ___________________*/
async function java_check() {
    javaVersion = "";
    try {
        javaVersion = await executeCommand('java --version');
        return 1
    } catch (error) {
        return 0
    }

}

/*________________ PYTHON __________________*/
async function python_check() {
    pythonVersion = "";
    try {
        pythonVersion = await executeCommand('python --version');
        return 1
    } catch (error) {
        return 0
    }

}

/******************************************* Skript zum Installieren ******************************************************/
async function script_installer() {
    /** Erzeugt Admin Terminal und setzt das Verzeichnis auf das Heimatverzeichnis */
    commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(getPath().userHome)).then(async () => {
        if (getOSBoolean('Windows')) {
            if (getComputerraumConfig()) {
                //await addNewPath('C:\\Program Files\\mingw64\\bin')
            } else {
                /** Führt den Befehl aus das Skript zur installation auszuführen */
                writeLog("Windows Skript wurde ausgeführt", "INFO")
                commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'powershell -Command \"Start-Process cmd -Verb runAs -ArgumentList \'/k curl -o %temp%\\vsc.cmd https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/support_python_java/script/vscwindows.cmd && %temp%\\vsc.cmd\'\"\n' })
            }
        } else if (getOSBoolean('MacOS')) { /** wenn Mac, führt Skript zur installation aus */
            writeLog("Mac Skript wurde ausgeführt", "INFO")
            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
        } else if (getOSBoolean('Linux')) { /** wenn Linux, führt Skript zur installation aus */
            writeLog("Linux Skript wurde ausgeführt", "INFO")
            commands.executeCommand('workbench.action.terminal.sendSequence', { text: 'sudo snap install curl && curl -sL https://raw.githubusercontent.com/hshf1/HSH_AddOn4VSC/master/script/vsclinuxosx.sh | bash\n' })
        }
    })
}
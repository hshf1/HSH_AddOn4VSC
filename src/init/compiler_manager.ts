/*  Dieses Modul enthält Funktionen, die überprüfen welche Programmiersprachen bereits installiert sind und installiert sie ggf. 
    nach bzw. gibt entsprechende Fehler aus */

import { window, commands, Uri } from "vscode"
import * as vscode from 'vscode'
import { exec, ExecException } from 'child_process'

import { getComputerraumConfig } from "./initMain"
import { getOSBoolean } from "./os"
import { getPath } from "./paths"




/** Funktion die Aufgerufen wird und dann je nach Betriebssystem den entsprechenden Compiler Check macht */
export async function global_compiler_checker() {
    if (getOSBoolean('Windows')) {

        if (getComputerraumConfig()) {
            await windows_hsh_check_compiler() //Compiler Check HSH Windows
        } else {
            await windows_check_compiler() //Compiler Check Privat Winwos
        }

    } else if (getOSBoolean('MacOS')) {

        await osx_check_compiler() //Compiler Check MacOS

    } else if (getOSBoolean('Linux')) {

        await linux_check_compiler() //Compiler Check Linux

    }
}

/************************** WINDOWS *******************************/
/** Funktion die überprüft welche Compiler bereit installiert sind und ggf. nach installiert */

async function windows_check_compiler() {

    let Version_INFO = "";

    await commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(getPath().userHome)).then(async () => {
        //TODO Durch Funktionen ersetzen
        /*______________ Chocolatey ________________*/
        try {
            const chocoVersion = await executeCommand('choco --version');
            Version_INFO += `Chocolatey gefunden!\n${chocoVersion}\n\n`;
        } catch (error) {
            Version_INFO += "Chocolatey: FEHLT\n\n";
        }

        /*_________________ C _____________________*/
        try {
            const gccVersion = await executeCommand('gcc --version');
            Version_INFO += `GCC gefunden!\n${gccVersion}\n\n`;
        } catch (error) {
            Version_INFO += "GCC Compiler: FEHLT \n\n";
        }

        /*_________________ JAVA ___________________*/
        try {
            const javaVersion = await executeCommand('java --version');
            Version_INFO += `Java gefunden!\n${javaVersion}\n\n`;
        } catch (error) {
            Version_INFO += "Java: FEHLT\n\n";
        }

        /*________________ PYTHON __________________*/
        try {
            const pythonVersion = await executeCommand('python --version');
            Version_INFO += `Python gefunden!\n${pythonVersion}\n\n`;
        } catch (error) {
            Version_INFO += "Python: FEHLT\n\n";
        }

    })

    window.showInformationMessage(Version_INFO, { modal: true }, 'OK');
}

/**************************** MAC *********************************/
/** Funktion die überprüft welche Compiler bereit installiert sind und ggf. nach installiert */

async function osx_check_compiler() {
    /*______________ Homebrew __________________*/

    /*_________________ C _____________________*/

    /*_________________ JAVA ___________________*/

    /*________________ PYTHON __________________*/
}

/**************************** LINUX ********************************/
/** Funktion die überprüft welche Compiler bereit installiert sind und ggf. nach installiert */

async function linux_check_compiler() {
    /*_________________ C _____________________*/

    /*_________________ JAVA ___________________*/

    /*________________ PYTHON __________________*/
}

/************************ HSH-Rechner ****************************/
/** Funktion die überprüft welche Compiler bereit installiert sind und ggf. nach installiert */

async function windows_hsh_check_compiler() {
    /*_________________ C _____________________*/

    /*_________________ JAVA ___________________*/

    /*________________ PYTHON __________________*/
}

function executeCommand(command: string): Promise<string> {
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
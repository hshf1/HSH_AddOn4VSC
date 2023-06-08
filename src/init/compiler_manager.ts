/*  Dieses Modul enthält Funktionen, die überprüfen welche Programmiersprachen bereits installiert sind und installiert sie ggf. 
    nach bzw. gibt entsprechende Fehler aus */

import { window, commands, Uri } from "vscode"
import * as vscode from 'vscode'
import { exec } from 'child_process'

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
    let Version_INFO:String

    commands.executeCommand('workbench.action.terminal.newWithCwd', Uri.file(getPath().userHome)).then(async () => {
        /*______________ Chocolatey ________________*/
        exec('choco --version', (error, stdout) => {
            if (error) {
                Version_INFO = "NULL"
            } else {     
                window.showInformationMessage(`Chocolatey gefunden! Informationen zum choco: ${stdout.trim()} `, { modal: true }, 'OK')
                Version_INFO = Version_INFO + stdout.trim()
            }
        })
        /*_________________ C _____________________*/
        exec('gcc --version', (error, stdout) => {
            if (error) {
                Version_INFO = "NULL"
            } else {
                //window.showInformationMessage(`Compiler gefunden! Informationen zum Compiler: ${stdout.trim()} `, { modal: true }, 'OK')
                Version_INFO = Version_INFO + stdout.trim()
            }
        })

        /*_________________ JAVA ___________________*/
        exec('java --version', (error, stdout) => {
            if (error) {
                Version_INFO = "NULL"
            } else {
                //window.showInformationMessage(`Java gefunden! Informationen zu Java: ${stdout.trim()} `, { modal: true }, 'OK')
                Version_INFO = Version_INFO + stdout.trim()
            }
        })


        /*________________ PYTHON __________________*/
        exec('python --version', (error, stdout) => {
            if (error) {
                Version_INFO = "NULL"
            } else {
                //window.showInformationMessage(`Python3 gefunden! Informationen zu Pythonpytho: ${stdout.trim()} `, { modal: true }, 'OK')
                Version_INFO = Version_INFO + stdout.trim()
            }
        })
        
    })

    //window.showInformationMessage(`Version_INFO: ${Version_INFO} `, { modal: true }, 'OK')
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

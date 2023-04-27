/** Dieses Modul enthält den Inhalt der .json Dateien, das testprogc und die Eigenschaften der Befehle  */

import { Command } from "vscode" /** Importiert die Command Schnittstelle aus der VSCode Modul */

import { getCompilerPath, getFilesEncoding } from "./init" /** Importiert die Funktion die den CompilerPfad bestimmt und die Funktion die das Encoding Format bestimmt */

export function getConstCommands(): Command[] {
    return [ /** Definiert die einzelnen Befehle in einem Array. */
    { command: 'extension.on', title: "Erweiterung wieder aktivieren" },
    { command: "extension.off", title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode pausieren" },
    { command: 'default.settingsjson', title: 'settings.json zurücksetzen' },
    { command: 'default.tasksjson', title: 'tasks.json zurücksetzen' },
    { command: 'open.link', title: 'Öffne Link' },
    { command: 'install.compiler', title: 'Compiler installieren' },
    { command: 'setRZHsH.setting', title: 'HsH Rechenzentrum' },
    { command: 'report.problem', title: 'Problem melden'},
    { command: 'switch.language_c', title: 'C'},
    { command: 'switch.language_java', title: 'Java'},
    { command: 'switch.language_python', title: 'Python'}
    //TODO Compiler Check für C, Java und Python ohne automatischen Dowload ?
]
}

/** Globale Funktion die das Testprogramm zurückgibt */
export function getTestProgC() {
    return `#include <stdio.h>

int main()
{
    int i; // Laufvariable i
    float y;

    i=0;
    printf("Hallo!\\n");
    i=i+1;
    printf("Hallo 1!\\n");
    i=i+1;
    printf("Hallo 2!\\n");
    i=i+1;
    printf("Hallo 3!\\n");
    y = 12 + 4 % 3 * 7 / 8;
    return 0;
}`
}

/** Globale Konstante die das Testprogramm für java enthält */
export const testprogjava = `public class HelloWorld {
    public static void main(String[] args) {

        System.out.println("Java said, Hello, World!");
        int i = 1;
        System.out.println(i);
        i++;
        System.out.println(i);
        i++;
        System.out.println(i);
        i++;
        System.out.println(i);

    }
}`

/** Globale Konstante die das Testprogramm für python enthält */
export const testprogpython = `print("Python said, Hello World!")
i = 1
print(i)
i += 1
print(i)
i += 1
print(i)
i += 1
print(i)
`

/** Globale Funktion die den Inhalt für Settings.json zurückgibt */
export function getSettingsJsonData() {
    let temp = getFilesEncoding() /** Speichert das Encoding Format und baut es in den Inhalt ein*/

    let settingsjsondata = `{
        // Allgemeine Nutzereinstellungen
        "addon4vsc.computerraum": false,                // Standort für Windows Rechner (Privat = false, HsH = true)
        "liveshare.anonymousGuestApproval": "accept",   // Live Share eingeladene Anonyme Nutzer automatisch akzeptieren
        "liveshare.guestApprovalRequired": false,       // Live Share um eingeladene Nutzer automatisch zu akzeptieren auf false einstellen
        "extensions.ignoreRecommendations": true,       // Keine Empfehlungen mehr Anzeigen
        "files.encoding": "${temp}",                       // Zur richtigen Darstellung von Umlauten
        //"files.autoGuessEncoding": true,              // Zurzeit deaktiviert, da noch instabil! Automatische Anpassung der Encodierung, falls möglich
        "editor.unicodeHighlight.nonBasicASCII": false, // Nicht Basic ASCII Zeichen nicht hervorheben
        "files.autoSave": "onFocusChange",              // Dateien werden bei Änderungen des Fokus automatisch gespeichert
        "code-runner.saveFileBeforeRun": true,          // speichert aktuelle Datei bevor sie mit CodeRunner ausgeführt wird
        "editor.bracketPairColorization.enabled": true, // Um Klammern und andere farbig darzustellen
        "editor.insertSpaces": true,                    // Ersetzt ein Tab durch Leerzeichen
        "editor.tabSize": 4,                            // Setzt die Zahl der durch einen Tab zu ersetzenden Leerzeichen
        "editor.renderWhitespace": "none",              // Zeigt keine Leerzeichen ein 
        //"editor.renderWhitespace": "selection",       // Nur im markierten Bereich Leerzeichen anzeigen
        "C_Cpp.debugShortcut": false,                   // Deaktivieren der nicht getesteten neuen Funktion von C/C++ Erweiterung
        "code-runner.runInTerminal": true,              // Um Eingaben in seinem Programm tätigen zu können z.B. für scanf
        "code-runner.preserveFocus": false,             // damit springt man automatisch ins Terminal bei Abarbeitung
        "code-runner.defaultLanguage": "C",             // Default-Language Code-Runner
        // Einstellungen für den Debugger
        "launch": {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "debuggen",
                    "type": "cppdbg",
                    "request": "launch",
                    "stopAtEntry": false,
                    "externalConsole": false,
                    // macos-spezifische Einstellungen
                    "osx": {
                        "MIMode": "lldb",
                        "program": "\${fileDirname}/\${fileBasenameNoExtension}",
                        "cwd": "\${fileDirname}",
                        "preLaunchTask": "C/C++: gcc Aktive Datei kompilieren"
                    },
                    // windows-spezifische Einstellungen
                    "windows": {
                        "MIMode": "gdb",
                        "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
                        "cwd": "\${workspaceFolder}",
                        "preLaunchTask": "C/C++: gcc.exe Aktive Datei kompilieren"
                    },
                    // linux-spezifische Einstellungen
                    "linux": {
                        "MIMode": "lldb",
                        "program": "\${fileDirname}/\${fileBasenameNoExtension}",
                        "cwd": "\${fileDirname}",
                        "preLaunchTask": "C/C++: gcc Aktive Datei kompilieren"
                    }
                }
            ]
        }
    }`

    return settingsjsondata
}

/** Globale Funktion die den Inhalt für Task.json zurückgibt */
export function getTasksJsonData() {
    let temp = getCompilerPath() /** Speichert Compilerpfad zwischen und baut ihn in den Inhalt ein */

    let tasksjsondata = `{
        "version": "2.0.0",
        "tasks": [
            {
                "type": "cppbuild",
                "label": "C/C++: gcc Aktive Datei kompilieren",
                "command": "/usr/bin/gcc",
                "args": [
                    "-g",
                    "\${file}",
                    "-o",
                    "\${fileDirname}/\${fileBasenameNoExtension}"
                ],
                "options": {
                    "cwd": "\${fileDirname}"
                },
                "problemMatcher": [
                    "$gcc"
                ],
                "group": {
                    "kind": "build",
                    "isDefault": true
                },
                "detail": "Vom Debugger generierte Aufgabe."
            },
            {
                "type": "cppbuild",
                "label": "C/C++: gcc.exe Aktive Datei kompilieren",
                "command": "${temp}",
                "args": [
                    "-g",
                    "\${file}",
                    "-o",
                    "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe"
                ],
                "options": {
                    "cwd": "\${workspaceFolder}"
                },
                "problemMatcher": [
                    "$gcc"
                ],
                "group": {
                    "kind": "build",
                    "isDefault": true
                },
                "detail": "Compiler: ${temp}"
            }
        ]
    }`

    return tasksjsondata
}
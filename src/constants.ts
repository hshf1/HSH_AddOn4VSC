/** Dieses Modul enthält den Inhalt der .json Dateien, das testprogc und die Eigenschaften der Befehle  */

import { Command } from "vscode" /** Importiert die Command Schnittstelle aus der VSCode Modul */

import { getComputerraumConfig, getProgLanguageConfig } from "./init/initMain" /** Importiert die Funktion die den CompilerPfad bestimmt und die Funktion die das Encoding Format bestimmt */
import { getOSBoolean } from "./init/os"

export function getConstCommands(): Command[] {
    return [ /** Definiert die einzelnen Befehle in einem Array. */
        { command: 'extension.on', title: "Erweiterung wieder aktivieren" },
        { command: "extension.off", title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode pausieren" },
        { command: 'default.settingsjson', title: 'settings.json zurücksetzen' },
        { command: 'default.tasksjson', title: 'tasks.json zurücksetzen' },
        { command: 'open.link', title: 'Öffne Link' },
        { command: 'install.compiler', title: 'Compiler installieren' },
        { command: 'setRZHsH.setting', title: 'HsH Rechenzentrum' },
        { command: 'report.problem', title: 'Problem melden' },
        { command: 'switch.language', title: 'C' },
        { command: 'switch.folder', title: 'In das Verzeichnis der aktuell geöffneten Datei wechseln' },
        { command: 'settingsjson.open', title: 'Aktuelle settings.json öffnen'}, // 10
        { command: 'oldsettingsjson.open', title: 'Alte settings.json öffnen'},
        { command: 'settingsjson.add', title: 'Fehlende Einstellungen in die settings.json setzen'}
        //TODO Compiler Check für C, Java und Python ohne automatischen Dowload ?
    ]
}

/** Globale Funktion die das Testprogramm zurückgibt */
export function getTestProg() {
    const PROGLANGUAGE = getProgLanguageConfig()

    if (PROGLANGUAGE === 'C') {
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
    } else if (PROGLANGUAGE === 'Java') {
        return `public class HelloWorld {
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
    } else if (PROGLANGUAGE === 'Python') {
        return `print("Python said, Hello World!")
i = 1
print(i)
i += 1
print(i)
i += 1
print(i)
i += 1
print(i)`
    } else {
        return ''
    }
}

/** Globale Funktion die den Inhalt für Task.json zurückgibt */
function getTasksContent() {
    return `{
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
            "command": "gcc.exe",
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
            "detail": "Compiler: gcc.exe"
        }
    ]
}`
}
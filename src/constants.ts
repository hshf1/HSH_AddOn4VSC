import { Command } from "vscode";

import { getProgLanguageString } from "./init/language";

export function getConstCommands(): Command[] {
    return [
        { command: 'extension.on', title: "Erweiterung wieder aktivieren" }, // 0
        { command: "extension.off", title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode pausieren" },
        { command: 'default.settingsjson', title: 'settings.json zurücksetzen' },
        { command: 'default.tasksjson', title: 'tasks.json zurücksetzen' },
        { command: 'open.link', title: 'Öffne Link' },
        { command: 'install.compiler', title: 'C Compiler prüfen / installieren' }, // 5
        { command: 'setRZHsH.setting', title: 'HsH Rechenzentrum' },
        { command: 'report.problem', title: 'Problem melden' },
        { command: 'switch.language', title: 'C' },
        { command: 'switch.folder', title: 'In das Verzeichnis der aktuell geöffneten Datei wechseln' },
        { command: 'settingsjson.open', title: 'Aktuelle settings.json öffnen'}, // 10
        { command: 'oldsettingsjson.open', title: 'Alte settings.json öffnen'},
        { command: 'settingsjson.add', title: 'Fehlende Einstellungen in die settings.json setzen'},
        { command: 'tasks.open', title: 'Aktuelle tasks.json öffnen'},
        { command: 'javacompiler.install', title: 'Java Compiler prüfen / installieren' },
        { command: 'pythoncompiler.install', title: 'Python Compiler prüfen / installieren' }, // 15
        { command: 'logfile.open', title: 'Aktuelle LogFile öffnen'},
        { command: 'chocolatey.install', title: 'Chocolatey installieren'},
        { command: 'chocolatey.uninstall', title: 'Chocolatey deinstallieren'},
        { command: 'logfile.open', title: 'Aktuelle LogFile öffnen'},
        { command: 'logfile.open', title: 'Aktuelle LogFile öffnen'} // 20
    ];
}

export function getTestProg() {
    const PROGLANGUAGE = getProgLanguageString();

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
}`;
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
}`;
    } else if (PROGLANGUAGE === 'Python') {
        return `print("Python said, Hello World!")
i = 1
print(i)
i += 1
print(i)
i += 1
print(i)
i += 1
print(i)`;
    } else {
        return '';
    }
}
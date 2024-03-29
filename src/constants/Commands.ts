import { Command } from "vscode";

export function getCommands(): Command[] {
    return [
        { command: 'extension.on', title: "Erweiterung wieder aktivieren" }, // 0
        { command: "extension.off", title: 'Erweiterung bis zum nächsten (Neu-)Start von VSCode pausieren' },
        { command: 'default.settingsjson', title: 'settings.json zurücksetzen' },
        { command: 'default.tasksjson', title: 'tasks.json zurücksetzen' },
        { command: 'open.link', title: 'Öffne Link' },
        { command: 'install.compiler', title: 'C Compiler prüfen / installieren' }, // 5
        { command: 'setRZHsH.setting', title: 'HsH Rechenzentrum' },
        { command: 'report.problem', title: 'Problem melden' },
        { command: '', title: '' }, // Derzeit frei
        { command: 'switch.folder', title: 'In das Verzeichnis der aktuell geöffneten Datei wechseln' },
        { command: 'settingsjson.open', title: 'Aktuelle settings.json öffnen' }, // 10
        { command: 'oldsettingsjson.open', title: 'Alte settings.json öffnen' },
        { command: 'settingsjson.add', title: 'Fehlende Einstellungen in die settings.json setzen' },
        { command: 'tasks.open', title: 'Aktuelle tasks.json öffnen' },
        { command: 'javacompiler.install', title: 'Java Compiler prüfen / installieren' },
        { command: 'pythoncompiler.install', title: 'Python Compiler prüfen / installieren' }, // 15
        { command: 'logfile.open', title: 'Aktuelle LogFile öffnen' },
        { command: 'chocolatey.install', title: 'Chocolatey installieren' },
        { command: 'chocolatey.uninstall', title: 'Chocolatey deinstallieren' },
        { command: 'uninstall.compiler', title: 'C Compiler deinstallieren' }, 
        { command: 'javacompiler.uninstall', title: 'Java Compiler deinstallieren' }, // 20
        { command: 'pythoncompiler.uninstall', title: 'Python Compiler deinstallieren' }
    ];
}
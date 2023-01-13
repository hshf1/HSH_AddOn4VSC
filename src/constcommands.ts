import { Command } from "vscode"

export const constcommands: Command[] = [
    { command: 'exam.start', title: 'Starte C-Quiz' }, // [0]
    { command: 'extension.on', title: "Erweiterung wieder aktivieren" },
    { command: "extension.off", title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode pausieren" },
    { command: 'exam.stop', title: 'Beende C-Quiz' },
    { command: 'default.settingsjson', title: 'settings.json zurücksetzen' },
    { command: 'default.tasksjson', title: 'tasks.json zurücksetzen' }, // [5]
    { command: 'aufgabe1.pruefen', title: 'Aufgabe 1 prüfen' },
    { command: 'aufgabe2.pruefen', title: 'Aufgabe 2 prüfen' },
    { command: 'open.link', title: 'Öffne Link' } // nicht über object genutzt, aber vollständigkeitshalber hier aufgelistet
]
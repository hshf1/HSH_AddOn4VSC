import { Command } from "vscode"

export const constcommands: Command[] = [
    { command: 'exam.start', title: 'Starte C-Quiz' }, // [0]
    { command: 'extension.on', title: "Erweiterung wieder aktivieren" },
    { command: "extension.off", title: "Erweiterung bis zum nächsten (Neu-)Start von VSCode deaktivieren" },
    { command: 'exam.stop', title: 'Beende C-Quiz' },
    { command: 'default.settingsjson', title: 'settings.json zurücksetzen'},
    { command: 'default.tasksjson', title: 'tasks.json zurücksetzen'}, // [5]
    { command: 'aufgabe1.pruefen', title: 'Aufgabe 1 prüfen'},
    { command: 'aufgabe2.pruefen', title: 'Aufgabe 2 prüfen'},
    { command: 'aufgabe3.pruefen', title: 'Aufgabe 3 prüfen'},
    { command: 'aufgabe4.pruefen', title: 'Aufgabe 4 prüfen'},
    { command: 'aufgabe5.pruefen', title: 'Aufgabe 5 prüfen'}, // [10]
    { command: 'aufgabe6.pruefen', title: 'Aufgabe 6 prüfen'},
    { command: 'aufgabe7.pruefen', title: 'Aufgabe 7 prüfen'},
    { command: 'aufgabe8.pruefen', title: 'Aufgabe 8 prüfen'},
    { command: 'aufgabe9.pruefen', title: 'Aufgabe 9 prüfen'},
    { command: 'aufgabe10.pruefen', title: 'Aufgabe 10 prüfen'}, // [15]
    { command: 'aufgabe11.pruefen', title: 'Aufgabe 11 prüfen'},
    { command: 'menue.show', title: 'Menü anzeigen'},
    { command: 'aufgabe11.pruefen', title: 'Aufgabe 11 prüfen'},
    { command: 'aufgabe11.pruefen', title: 'Aufgabe 11 prüfen'},
    { command: 'aufgabe11.pruefen', title: 'Aufgabe 11 prüfen'} // [20]
]
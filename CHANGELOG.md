# Changelog

Alle wichtigen Änderungen werden hier gespeichert und veröffentlicht.

Das Changelog-Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

--------- 

## [1.8.0] - 24.08.2023

### neu hinzugefügt
- 

### geändert
- Pfade den Umgebungen in der HsH angepasst
- Alle Skripte in die Erweiterung implementiert

## [1.7.0] - [1.7.10] - 30.04.2023 - 07.06.2023

### neu hinzugefügt
- ProgressBar für Initialisierung und Problem melden
- Befehl um in aktuelles Verzeichnis der offenen Datei zu wechseln in der Activity Bar
- Das Addon muss nun nicht mehr jedes mal erneut im PC Raum heruntergeladen werden, sondern wird auf dem Benutzerprofil des Studenten gespeichert

### geändert
- Bugfix in den Umgebungsvariablen am Windows
- E-Mail Adresse wird beim Problem melden automatisch vorgefüllt mit "@stud.hs-hannover.de"
- Neuer Ordner .../Code/User/HSH_AddOn4VSC für logFile und VersionControl
- Kontrolliert den Dateinamen nun auch auf "." im Namen und ersetzt durch "_"
- Scanf Fehler beim Debbugen an Mac PC's behoben

## [1.6.0] - [1.6.14] 27.04.2023 - 30.04.2023 

### neu hinzugefügt
- in der Activity Bar Reiter "Programmiersprache ändern" hinzugefügt.
- HelloWorld.java hinzugefügt
- Addon erstellt eigenen Übungsordner für Java, wenn ausgewählt
- neue Datei Language_Handler.ts hinzugefügt. Aufgabe ist es zu managen welche Prog.sprache gerade benutzt werden/wird soll.
- die Folderpaths angegeben für den neuen Ordner + Datei
- Java und Python Deps eingefügt (wieder entfernt vorerst)
- Addon erstellt Automatisch die Ordner und die HelloWorld Dateien (Java und Python).
- Wechseln der Programmiersprache zu einer anderen Sprache als C ist derzeit nur für HsH Rechner möglich
- AutoUpdate bei Änderung in der Master-Branch

### geändert
- bugfixes
- Compilerpfad auf "gcc.exe" geändert
- OpenPreFolder() angepasst und variabler gestaltet
- die Kontrolle ob .c am Ende erst mal auskommentiert (Kann später vlt, schauen ob entprechend .c oder .java und co ist)
- in Reportporblems eine Nachricht gekürzt um Verwirrung zu vermeiden.
- neue Pfade für mingw64 an den HsH-Rechnern
- Code angepasst, effizienter und lesbarer

## [1.5.1] - [1.5.8] 23.04.2023 - 26.04.2023

### neu hinzugefügt

- Problem melden als neue Funktion in der Activity Bar (linke Menüleiste)
- LogFile-System hinzugefügt

### geändert

- Code der Funktion "Problem melden" angepasst
- automatisches hinzufügen/ändern der '.c'-Dateiendung (vorerst) ausgeschaltet
- Problem melden: Screenshot, Inhalt aus Terminals und Code kann angehängt werden
- Problem melden angepasst
- LogFile angepasst
- Initialisierung vereinfacht

## [1.5.0] 06.04.2023

### neu hinzugefügt

- Aktualisierung der Pfade und der tasksjson automatisch und ohne neustart von VSCode

### geändert

- Lesbarkeit des Codes angepasst
- Kleinere Fehler behoben

## [1.4.0] - [1.4.18] 19.03.2023 - 05.04.2023

### neu hinzugefügt

- Möglichkeit zur Speicherung der Einstellung, welcher Pfad genutzt werden soll (privater Windows oder HsH RZ Windows)
- Einstellung, das speichert, ob HsH oder Privat Nutzung
- HsH Text-Logo in der Activity Bar zur besseren Übersicht
- Kommentare im Code
- Skripte nun im HSH_AddOn4VSC - Links zu den Skripten in der Installationsanleitung auf GitHub wurden angepasst

### geändert

- Quellcode der Extension nun im GitHub der HsH zu finden unter: [GitHub HSH_AddOn4VSC](https://github.com/hshf1/HSH_AddOn4VSC)
- Code umgeschrieben zur besseren Lesbarkeit
- Nicht benötigte Zeilen Code wurden entfernt
- Kompatibilität mit älteren VSCode Versionen angesetzt
- Ausführung der Installationsskripts angepasst
- Automatische Pfad-Zuordnung, wenn im RZ gestartet wird
- Windows: Skript wird nicht mehr automatisch ausgeführt, auswahl zwischen privaten und HsH Windows
- Fehlerbehebungen
- Beim ändern von HsH oder privaten Windows-Rechner wird tasks.json automatisch angepasst

<details>
<summary>[1.0.0] - [1.3.0]</summary>

## [1.3.0] 20.01.2023

### geändert

- Extension-Name zu HSH_AddOn4VSC geändert
- Compiler automatisch mit installieren, wenn es fehlt

## [1.2.0] - [1.2.4] 14.01.2023 - 20.01.2023

### neu hinzugefügt

- Für das RZ der HsH angepasst, PopUp für Einstellungen zum Ändern auf RZ-Pfade
- Compiler installieren, führt Skript über GitHub aus für Windows, Linux und MacOS (Unter Einstellungen in der Activity-Bar)

### geändert

- Fehlerbehebung: Beim automatischen umbenennen wird nun, falls es schon den Namen gibt, ein "_1" angehängt
- Dateien zusammengefasst, wenn möglich
- C-Quiz vorerst entfernt, um Verwirrung zu vermeiden
- testprog.c angepasst an Vorlesung

## [1.1.0] - [1.1.6] 05.01.2023 - 13.01.2023

### neu hinzugefügt

- settings.json und tasks.json auf "default" zurücksetzen
- Übungsaufgaben prüfen auf Output und Anforderungen
- Möglichkeit, dass Admins über GitHub Links in die Extension einbinden
- Automatische Erkennung von Variablen link_name, link und gueltig_bis, Link läuft ab beim setzen von gueltig_bis
- Möglichkeit, Aufgaben nach Output überprüfen und Anforderungen vorgeben (Aufgaben an sich fehlen noch)

### geändert

- Statusbar nur noch zur Aktivierung/Pausierung der Erweiterung
- Quiz nun auch über GitHub anpassbar und Quiz-Fragen und Antworten werden nun gemischt statt hintereinander abgefragt zu werden
- Änderung der Punkte in der Activitybar
- Effizientere schreibweise vom Code
- globale Variablen vor allem in extsettings.ts definiert
- noch mehr commands hinzugefügt
- Aufgabenüberprüfung ausgeblendet, da noch im Test und nicht freigegeben

## [1.0.0] -[1.0.2] 02.01.2023

### neu hinzugefügt

- Menü (Statusbar unten und Activitybar links)
- Möglichkeit, Erweiterung über Menü bis zur nächsten manuellen oder automatische Aktivierung zu deaktivieren
- Möglichkeit, auf Buttondruck Namen direkt auf zu ändern (Umlaute und Leerzeichen)
- C-Quiz
- Statusbar-Tool zum starten vom C-Quiz
- Integration für Windows und Linux

### geändert

- json-Dateien sind nun zusammengefasst und die Einstellungen in den jeweiligen einzelnen Dateien Plattform-spezifisch beschrieben.
- Effizientere schreibweise vom Code.

</details>

<details>
<summary>[0.0.1] - [0.0.10]</summary>

## [0.0.1] - [0.0.10] 26.12.2022 - 28.12.2022

### neu hinzugefügt

- Auf die Dateiendung achten. Alles außer ".c" ist falsch und es kommt eine Warnmeldung.
- Datei- und Verzeichnisnamen auf Leerzeichen und Umlaute überprüfen und warnen.
- Die settings.json, launch.json und tasks.json erstellen, wenn nicht vorhanden.
- Das vordefinierte Verzeichnis soll erstellt werden, falls noch nicht vorhanden.
- Vordefinierter Ordner (in Dokumente, Name: C_Uebung) wird automatisch geöffnet, falls vorhanden.
- Öffnen eines Ordners zu Beginn von VSCode nur dann, falls kein Ordner bereits geöffnet ist.
- Erkennung vom Betriebssystem.
- Installation aller erforderlichen Extensions zu Beginn von VSCode, falls diese fehlen.
- Die Idee, die VorlesungC mithilfe dieser Erweiterung zu unterstützen.

### bearbeitet

- Aufruf der Ordnerabfrage wurde angepasst.
- Die Methode, um die json-Dateien zu bekommen wurde angepasst.
- Überprüfung auf vorhandensein der benötigten Extensions wurde verbessert.
- Methode, um zum Pfad des Ordners zu gelangen wurde angepasst. (MacOS)
- Abfrage zum Ordner öffnen nur dann, wenn vordefinierter Ordner nicht gefunden wird.

</details>

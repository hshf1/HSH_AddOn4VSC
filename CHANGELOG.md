# Changelog

Alle wichtigen Änderungen werden hier gespeichert und veröffentlicht.

Das Changelog-Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### neu hinzugefügt 

- Ggf. Möglichkeiten mit dem Debugger in betracht ziehen.
- Ausführen von externen Skripten

### fertig

- 

## [1.1.0] - [1.1.7] 05.01.2023 - 14.01.2023

### neu hinzugefügt

- settings.json und tasks.json auf "default" zurücksetzen
- Übungsaufgaben prüfen auf Output und Anforderungen
- Möglichkeit, dass Admins über GitHub Links in die Extension einbinden
- Automatische Erkennung von Variablen link_name, link und gueltig_bis, Link läuft ab beim setzen von gueltig_bis
- Möglichkeit, Aufgaben nach Output überprüfen und Anforderungen vorgeben (Aufgaben an sich fehlen noch)
- Für das RZ der HsH angepasst
- Compiler installieren, führt Skript über GitHub aus für Windows, Linux und MacOS (Unter Einstellungen in der Activity-Bar)

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
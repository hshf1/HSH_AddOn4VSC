import { StatusBarAlignment, window } from 'vscode'

export const IS_WINDOWS = process.platform.startsWith('win')
export const IS_OSX = process.platform == 'darwin'
export const IS_LINUX = !IS_WINDOWS && !IS_OSX

export const menue_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
menue_button.text = 'VorlesungC-Menü'
menue_button.tooltip = 'Klicken, um zum Menü zu gelangen'
menue_button.command = 'menue.show'
menue_button.show()

export const testprogc = `#include <stdio.h>

int main() {
    int x = 1;
    x++;

    printf("Erinnerung: Datei- und Verzeichnisname dürfen keine Umlaute oder Leerzeichen haben!\\n");
    printf("Das Ergebnis von x lautet: %d\\n",x);
}`
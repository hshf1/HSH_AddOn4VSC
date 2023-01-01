// Betriebssystem bestimmen
export const IS_WINDOWS = process.platform.startsWith('win');
export const IS_OSX = process.platform == 'darwin';
export const IS_LINUX = !IS_WINDOWS && !IS_OSX;

// Testprogramm für alle Betriebssysteme
export const testprogc = `#include <stdio.h>

int main() {
    int x = 1;
    x++;

    printf("Erinnerung: Datei- und Verzeichnisname dürfen keine Umlaute oder Leerzeichen haben!\\n");
    printf("Das Ergebnis von x lautet: %d\\n",x);
}`
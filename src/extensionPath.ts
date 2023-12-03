import { join } from "path";
import { exec } from "child_process";
import { ProgressLocation, window } from "vscode";
import { copy, ensureDir } from "fs-extra";

import { getPath } from "./init/Paths";
import { getComputerraumConfig, restartVSC } from "./init/Init";
import { writeLog } from "./LogFile";
import { errorNotification, infoNotification } from "./Notifications";

let initExtensionsDirRunning = false;

export async function initExtensionsDir(): Promise<void> {
    if (!initExtensionsDirRunning) {
        initExtensionsDirRunning = true;
        const USERHOME = getPath().userHome;
        const VSCUSERDATA = getPath().vscUserData;

        const EXTENSIONSDIRPATH = `${USERHOME}\\.vscode\\extensions`;
        const EXTENSIONSDIRPATH_HSH = join(VSCUSERDATA, 'VSCODE_Extensions');

        const CURRENTEXTENSIONPATH = await getUserExtensionDir();

        if (getComputerraumConfig()) {
            if (CURRENTEXTENSIONPATH === EXTENSIONSDIRPATH_HSH) {
                writeLog(`Extensionpfad bereits gesetzt: ${EXTENSIONSDIRPATH_HSH}`, "INFO");
            } else {
                exec(`setx VSCODE_EXTENSIONS ${EXTENSIONSDIRPATH_HSH}`);
                writeLog(`Extensionspfad neu gesetzt: ${EXTENSIONSDIRPATH_HSH}`, 'INFO');
                copyExtensions(EXTENSIONSDIRPATH, EXTENSIONSDIRPATH_HSH);
            }
        } else if (!getComputerraumConfig() && CURRENTEXTENSIONPATH !== "%VSCODE_EXTENSIONS%") {
            exec(`setx VSCODE_EXTENSIONS ""`);
            writeLog(`Extensionspfad zurückgesetzt`, 'INFO');
        }
        initExtensionsDirRunning = false;
    }
}

export function getUserExtensionDir(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('echo %VSCODE_EXTENSIONS%', (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

function copyExtensions(sourcePath: string, destPath: string): void {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Kopiere Extensions...',
        cancellable: false
    }, async (progress, token) => {
        try {
            await ensureDir(destPath);
            infoNotification(`Kopiervorgang der Extensions begonnen`);
            progress.report({ message: "Kopiervorgang...", increment: 50 });
            await copy(sourcePath, destPath, {
                overwrite: true,
                errorOnExist: false,
            });
            progress.report({ message: `Kopiervorgang der Extensions abgeschlossen`, increment: 100 });
        } catch (error) {
            errorNotification(`Fehler beim kopieren des Addons: ${error}`, true);
        }
    }).then(() => {
        restartVSC();
    });
}
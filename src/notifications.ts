import { ProgressLocation, window } from "vscode";

import { writeLog } from "./logfile";

export function infoNotification(msg: string, showUser?: boolean, modal?: boolean) {
    writeLog(`${msg}`, 'INFO');

    if (showUser) {
        window.showInformationMessage(msg, { modal: modal ? modal : false }, 'OK');
    }
}

export function errorNotification(msg: string, showUser?: boolean, modal?: boolean) {
    writeLog(`${msg}`, 'ERROR');

    if (showUser) {
        window.showErrorMessage(msg, { modal: modal ? modal : false }, 'OK');
    }
}

export function warningNotification(msg: string, showUser?: boolean, modal?: boolean) {
    writeLog(`${msg}`, 'WARNING');

    if (showUser) {
        window.showWarningMessage(msg, { modal: modal ? modal : false }, 'OK');
    }
}

export function withProgressNotification(title: string, cancellableValue: boolean, callback: () => void) {
    window.withProgress({
        location: ProgressLocation.Notification,
        title: `${title}`,
        cancellable: cancellableValue
    }, async (progress, token) => {
        callback();
    });
}
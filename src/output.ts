import { window } from 'vscode'

export function error_message(error_text: string) {
    window.showErrorMessage(error_text)
}

export function information_message(info_text: string) {
    window.showInformationMessage(info_text)
}

export function warning_message(warning_text: string) {
    window.showWarningMessage(warning_text)
}

export function quickpick_output() {

}
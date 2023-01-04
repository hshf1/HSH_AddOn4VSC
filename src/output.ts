import { window } from 'vscode'

export function error_message(error_text: string) {
    window.showErrorMessage(`${error_text}`)
}

export function information_message(info_text: string) {
    window.showInformationMessage(`${info_text}`)
}

export function quickpick_output() {

}

export function output_channel() {
    
}